import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import WebviewCrypto from 'react-native-webview-crypto';
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';

import { useGun, GunProvider } from './GunContext';

const App = () => {
  const [name, setName] = useState('');
  const { gun, SEA } = useGun();
  const node = useRef();

  useEffect(() => {
    if (gun) {
      node.current = gun.get('hello');
      node.current.once((data, key) => {
        let name = data?.name;
        setName(name);
      });

      async function doWork() {
        const workTest = await SEA.work('test', null, null, {
          name: 'SHA-256',
          encode: 'hex',
        });
        console.log(workTest);
        const pair = await SEA.pair();
        const other = await SEA.pair();
        const msg = await SEA.sign('I wrote this message! You did not.', pair);
        const test = await SEA.verify(msg, pair.pub); // message gets printed
        const test2 = await SEA.verify(msg, other.pub); // error
        console.log('No message', test2);
        console.log('Message', test);

        gun.on('auth', () => {
          console.log('authenticated with keypair');
        });

        const namespace = gun.user();
        namespace.auth(pair);
      }
      doWork();
    }
  }, [gun]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello {name}</Text>
      <WebviewCrypto />
      <View style={styles.flexRow}>
        <TextInput
          value={name}
          onChangeText={(value) => setName(value)}
          style={styles.input}
        />
      </View>
      <Button
        title="Save"
        onPress={() => {
          node.current.put({ name });
          setName(name);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    borderColor: '#4630eb',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
});

export default function AppContainer() {
  return (
    <GunProvider>
      <App />
    </GunProvider>
  );
}

registerRootComponent(AppContainer);
