import React from "react";
import { useColorMode, Button, Tooltip } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export const Colormodebtn = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Tooltip
      label={colorMode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"}
      aria-label="A tooltip"
    >
      <Button onClick={toggleColorMode} mr="2" variant={"ghost"}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Tooltip>
  );
};
