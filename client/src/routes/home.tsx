import { PlayIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box className="p-4 flex gap-4">
      <Card className="w-48">
        <Text>Singleplayer</Text>
        <Box className="pt-2">
          <Link to="singleplayer">
            <Button asChild>
              <span>
                <PlayIcon /> Play
              </span>
            </Button>
          </Link>
        </Box>
      </Card>

      <Card className="w-48">
        <Text>Multiplayer</Text>
        <Box className="pt-2">
          <Link to="multiplayer">
            <Button asChild>
              <span>
                <PlayIcon /> Play
              </span>
            </Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export { Home };
