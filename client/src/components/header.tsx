import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box, IconButton } from "@radix-ui/themes";
import { FC } from "react";

import { useTheme } from "hooks";

interface HeaderProps {
  children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const { appearance, setAppearance } = useTheme();

  const handleClick = () => {
    setAppearance(appearance === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="bg-gray-800 p-4">
        <Box className="flex items-center justify-between">
          <Box>
            <h1 className="text-3xl text-white">Chess</h1>
          </Box>
          <Box>
            <IconButton onClick={handleClick}>{appearance === "dark" ? <MoonIcon /> : <SunIcon />}</IconButton>
          </Box>
        </Box>
      </header>
      {children}
    </>
  );
};

export { Header };
