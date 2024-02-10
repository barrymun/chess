import { grayDark } from "@radix-ui/colors";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";

import { useTheme } from "hooks";
import { repoUrl } from "utils";

interface HeaderProps {
  children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const { appearance, setAppearance } = useTheme();

  const bgColor = useMemo(() => (appearance === "dark" ? `bg-[${grayDark.gray1}]` : "bg-[#ffffff]"), [appearance]);

  const handleGitHubClick = () => {
    window.open(repoUrl, "_blank", "noopener noreferrer");
  };

  const handleAppearanceClick = () => {
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
            <Box className="flex justify-end gap-2">
              <Box>
                <Tooltip content="View GitHub" side="bottom">
                  <IconButton onClick={handleGitHubClick} className="hover:cursor-pointer">
                    <GitHubLogoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip content="Toggle theme" side="bottom">
                  <IconButton onClick={handleAppearanceClick} className="hover:cursor-pointer">
                    {appearance === "dark" ? <MoonIcon /> : <SunIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </header>
      </Box>
      <Box className="w-full h-full pt-16">{children}</Box>
    </>
  );
};

export { Header };
