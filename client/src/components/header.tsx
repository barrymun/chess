import { grayDark } from "@radix-ui/colors";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box, IconButton, Text } from "@radix-ui/themes";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";

import { useTheme } from "hooks";

interface HeaderProps {
  children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const { appearance, setAppearance } = useTheme();

  const bgColor = useMemo(() => (appearance === "dark" ? `bg-[${grayDark.gray1}]` : "bg-[#ffffff]"), [appearance]);

  const handleClick = () => {
    setAppearance(appearance === "dark" ? "light" : "dark");
  };

  return (
    <>
      <Box className={`fixed top-0 z-10 w-full shadow-lg ${bgColor}`}>
        <header className="sm:p-4 xs:p-2">
          <Box className="flex items-center justify-between">
            <Box>
              <Text className="text-3xl">
                <Link to="/">Chess</Link>
              </Text>
            </Box>
            <Box>
              <IconButton onClick={handleClick}>{appearance === "dark" ? <MoonIcon /> : <SunIcon />}</IconButton>
            </Box>
          </Box>
        </header>
      </Box>
      <Box className="w-full h-full pt-16">{children}</Box>
    </>
  );
};

export { Header };
