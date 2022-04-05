import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Link,
  Text,
  useToast,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { supabase } from "../../backend/supabaseClient";
import { useAuth } from "../../backend/Auth";

export const CardsetBox = ({ cardsetDesc, cardsetName, username }) => {
  return (
    <LinkBox as={'article'}
      maxW="sm"
      h={"100px"}
      maxH={"xs"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
    >
      <Heading as="h1" size={["xs", "s", "m", "l", "xl"]}>
      <LinkOverlay href={`/cardset/${username}/${cardsetName}`}>
        {cardsetName}
        </LinkOverlay>
      </Heading>
      <Text isTruncated textOverflow="ellipsis">
        {cardsetDesc}
      </Text>
    </LinkBox>
  );
};
