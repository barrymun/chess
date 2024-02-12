import { Theme } from "@radix-ui/themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "hooks";
import { Appearance } from "utils";

const systemAppearance: Appearance = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext(
  {} as {
    appearance: Appearance;
    setAppearance: React.Dispatch<React.SetStateAction<Appearance>>;
  },
);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { getValue, setValue } = useLocalStorage();
  const [appearance, setAppearance] = useState<Appearance>((getValue("appearance") as Appearance) ?? systemAppearance);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(appearance);
    setValue("appearance", appearance);
  }, [appearance]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
    }),
    [appearance, setAppearance],
  );

  return (
    <ThemeContext.Provider value={value}>
      <Theme
        accentColor="mint"
        grayColor="gray"
        panelBackground="solid"
        scaling="100%"
        radius="full"
        className="w-full h-full"
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
