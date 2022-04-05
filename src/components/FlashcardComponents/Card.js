import {
  Box,
  Link,
  Text,
  Code,
  Center,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import TeX from "@matejmazur/react-katex";

export const Card = ({ front, back, link, block_type, block_content, fontSize }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardClick = () => {
    setIsFlipped(!isFlipped);
  };

  function blockRender() {
    switch (block_type) {
      case "math":
        return (
          <Box fontSize={"2em"}>
            <TeX math={block_content} block />
          </Box>
        );
      case "code":
        return (
          <Code
            colorScheme="green"
            children={block_content}
            variant="solid"
            p="20px"
            w={"full"}
            borderRadius="5px"
            mt={"10px"}
            whiteSpace="pre-wrap"
          />
        );
      case "image":
        return (
          <Box h="300px" overflow="hidden">
            <Center w={"full"} maxW='400px' overflow="hidden">
                <Image src={block_content} objectFit="cover" />
            </Center>
          </Box>
        );
      default:
        return <></>;
    }
  }

  useEffect(() => {
    setIsFlipped(false)
  }, []);
  return (
    <>
      <ReactCardFlip isFlipped={isFlipped}>
        <Box
          display={"flex"}
          flexDirection="column"
          boxShadow={"md"}
          rounded="md"
          borderWidth="1px"
          p={5}
          h={["3xs", "3xs", "2xs", "2xs", "2xs", "sm"]}
          minH={"2xs"}
          maxH="sm"
          _hover={{ cursor: "pointer" }}
          onClick={cardClick}
          overflow="clip"
        >
          <Box flexGrow="1" display={'flex'} justifyContent='center' alignItems={'center'}>
            <Text fontSize={fontSize} textOverflow='clip' overflowWrap={'anywhere'}>{front}</Text>
          </Box>

          <Text
            isTruncated
            textOverflow="ellipsis"
            overflow={"hidden"}
            whiteSpace="nowrap"
          >
            Source/Link:{" "}
            <Link display={"inline"} href={link} isExternal>
              {link}
            </Link>
          </Text>
        </Box>

        <Box
          display={"flex"}
          flexDirection="column"
          alignItems={'center'}
          justifyContent='center'
          boxShadow={"md"}
          rounded="md"
          borderWidth="1px"
          p={5}
          h={["3xs", "3xs", "2xs", "2xs", "2xs", "sm"]}
          minH={"2xs"}
          maxH="sm"
          _hover={{ cursor: "pointer" }}
          onClick={cardClick}
          overflow="clip"
        >
          <Box flexGrow="1" display={'flex'} justifyContent='center' alignItems={'center'} flexDirection='column'>
            <Text fontSize={fontSize} wordBreak='break-all' textOverflow={'ellipsis'}>{back}</Text>
            <Box w={'full'}>{blockRender()}</Box>
          </Box>

          <Text
            isTruncated
            textOverflow="ellipsis"
            overflow={"hidden"}
            whiteSpace="nowrap"
          >
            Source/Link:{" "}
            <Link display={"inline"} href={link} isExternal>
              {link}
            </Link>
          </Text>
        </Box>
      </ReactCardFlip>
    </>
  );
};

Card.defaultProps ={
  front: "No Front Question Found",
  back: "",
  link: "",
  block_type: "none",
  block_content: null,
  fontSize: "1.25em"
}