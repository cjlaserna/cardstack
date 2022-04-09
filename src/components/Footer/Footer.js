import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";

export const Footer = () => {
  return (
    <Box
      backgroundSize={"cover"}
      pt={10}
      m="0"
      flexDirection={"column"}
      display="flex"
      justifyContent="center"
      alignItems={"center"}
    >
      <Heading size={"md"}>
        {" "}
        Made By{" "}
        <Link href="https://cjlaserna.github.io" isExternal>
          Catherine Laserna
        </Link>{" "}
      </Heading>
      <Button as={'a'} href='https://github.com/cjlaserna/cardstack/' variant={'link'} target='_blank'>View this project on Github. <ExternalLinkIcon /></Button>
    </Box>
  );
};
