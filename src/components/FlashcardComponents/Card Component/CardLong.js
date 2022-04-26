import {
    Box,
    Link,
    Text,
    Code,
    Center,
    Image,
    AspectRatio,
    SimpleGrid,
    Divider
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import TeX from "@matejmazur/react-katex";
import { Untabbable } from "react-untabbable";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierSulphurpoolDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { SupportedLang } from "./SupportedLang";

export const CardLong = ({
    front,
    back,
    link,
    block_type,
    block_content,
    block_language,
    fontSize,
    flipped,
    full,
}) => {

    const containerStyle = {
        padding: "var(--chakra-space-5)",
        borderRadius: "var(--chakra-space-5)"
    }

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
                    <SyntaxHighlighter
                        language={block_language}
                        wrapLongLines
                        useInlineStyles
                        customStyle={containerStyle}
                        style={atelierSulphurpoolDark}
                    >{block_content}</SyntaxHighlighter>
                );
            case "image":
                return (
                    <Box h="300px" overflow="hidden">
                        <Center w={"full"} maxW="400px" overflow="hidden">
                            <Image src={block_content} objectFit="cover" />
                        </Center>
                    </Box>
                );
            default:
                return <></>;
        }
    }

    return (
        <>
            <Box
                display={'block'}
                w='full'
            >

                <SimpleGrid
                    columns={2}
                    spacing={5}
                    boxShadow={"sm"}
                    minH={'3xs'}
                    rounded="md"
                    borderWidth="1px"
                    p={5}
                    w='full'
                    _hover={{ cursor: "pointer" }}
                    overflowY="auto">
                    <Box position={'relative'}>
                        <Box
                            h={'full'}
                            display={"flex"}
                            justifyContent='center'
                            alignItems={"center"}
                        >
                            <Text
                                fontSize={fontSize}
                                textOverflow="clip"
                                overflowWrap={"anywhere"}
                            >
                                {front}
                            </Text>
                        </Box>
                        <Divider orientation='vertical' position={'absolute'} right='0' top='0'/>
                    </Box>
                    <Box
                        flexGrow="1"
                        display={"flex"}
                        justifyContent="center"
                        alignItems={"center"}
                        flexDirection="column"
                    >
                        <Text
                            fontSize={fontSize}
                            wordBreak="break-word"
                            textOverflow={"ellipsis"}
                        >
                            {back}
                        </Text>
                        <Box w={"full"}>{blockRender()}</Box>
                    </Box>
                </SimpleGrid>
            </Box>
        </>
    );
};

CardLong.defaultProps = {
    front: "No Front Question Found",
    back: "",
    link: "",
    block_language: "plaintext",
    block_type: "none",
    block_content: null,
    fontSize: "1.25em",
    flipped: false,
    full: false,
};
