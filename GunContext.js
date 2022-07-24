import { createContext, useContext, useMemo } from 'react';
import * as SQLite from 'expo-sqlite';

import 'gun/lib/mobile';
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/promise';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import { makeStoreAdapter } from '@altrx/gundb-expo-sqlite-adapter';
makeStoreAdapter(Gun);

export const GunContext = createContext();
GunContext.displayName = 'GunContext';

export const GunProvider = (props) => {
  const value = useMemo(
    () => ({
      gun: new Gun({
        localStorage: false,
        radisk: true,
        sqlite: {
          SQLite,
          databaseName: 'todo.db',
          onOpen: () => {
            console.log('DB OPENED');
          },
          onError: (err) => {
            console.log('ERROR');
          },
          onReady: (err) => {
            console.log('READY');
          },
        },
      }),
      SEA,
    }),
    []
  );

  return <GunContext.Provider value={value} {...props} />;
};

export function useGun() {
  const context = useContext(GunContext);
  if (context === undefined) {
    throw new Error(`useGun must be used within a GunProvider`);
  }
  return context;
}
