import { mintDark } from "@radix-ui/colors";
import { Box } from "@radix-ui/themes";
import { FC } from "react";

interface LoaderProps {}

const Loader: FC<LoaderProps> = () => {
  return (
    <Box className="w-full h-full flex justify-center items-center">
      <Box className="h-20 w-20 animate-spin rounded-full border-8" style={{ borderTopColor: mintDark.mint9 }} />
    </Box>
  );
};

export { Loader };
