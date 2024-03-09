import { Box, Table, Text } from "@radix-ui/themes";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGameState } from "hooks";
import { mergeMoveHistory } from "utils";

interface MoveHistoryProps {}

const MoveHistory: FC<MoveHistoryProps> = () => {
  const { t } = useTranslation();
  const { gameRecord } = useGameState();
  const mergedMoveHistory = mergeMoveHistory(gameRecord.moveHistory);

  return (
    <Box
      className="
        overflow-y-scroll 
        min-w-44
        h-mh-table-mobile
        lg:block
        md:h-mh-table-desktop  
        sm:h-mh-table-desktop-sm
        xs:h-mh-table-desktop-xs
        xs:hidden 
      "
    >
      <Table.Root variant="surface" className="table-auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text>{t("players.white")}</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text>{t("players.black")}</Text>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {mergedMoveHistory.map((move, index) => (
            <Table.Row key={index}>
              <Table.ColumnHeaderCell>{`${index + 1}.`}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{move[0]}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{move[1]}</Table.ColumnHeaderCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export { MoveHistory };
