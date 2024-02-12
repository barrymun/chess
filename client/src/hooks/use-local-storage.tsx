import { createContext, useContext, useMemo } from "react";

import { LocalStorageKeys } from "utils";

interface LocalStorageProviderProps {
  children: React.ReactNode;
}

const LocalStorageContext = createContext(
  {} as {
    getValue(key: LocalStorageKeys): string | null;
    setValue(key: string, value: string): void;
  },
);

const LocalStorageProvider = ({ children }: LocalStorageProviderProps) => {
  const getValue = (key: LocalStorageKeys) => {
    return localStorage.getItem(key);
  };

  const setValue = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const value = useMemo(
    () => ({
      getValue,
      setValue,
    }),
    [getValue, setValue],
  );

  return <LocalStorageContext.Provider value={value}>{children}</LocalStorageContext.Provider>;
};

const useLocalStorage = () => useContext(LocalStorageContext);

export { LocalStorageProvider, useLocalStorage };
