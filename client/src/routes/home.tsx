import { PlayIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-4 flex gap-4">
      <Card className="w-48">
        <Text>{t("options.single-player")}</Text>
        <Box className="pt-2">
          <Link to="singleplayer">
            <Button asChild>
              <span>
                <PlayIcon />
                &nbsp;{t("options.play")}
              </span>
            </Button>
          </Link>
        </Box>
      </Card>

      <Card className="w-48">
        <Text>{t("options.multi-player")}</Text>
        <Box className="pt-2">
          <Link to="multiplayer">
            <Button asChild>
              <span>
                <PlayIcon />
                &nbsp;{t("options.play")}
              </span>
            </Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export { Home };
