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
import { Untabbable } from "react-untabbable";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierSulphurpoolDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { SupportedLang } from "./SupportedLang";
import "../../../assets/add.css";

export const Card = ({
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
	const [isFlipped, setIsFlipped] = useState(flipped);

	const cardClick = () => {
		setIsFlipped(!isFlipped);
	};

	const containerStyle = {
		padding: "var(--chakra-space-5)",
		borderRadius: "var(--chakra-space-5)",
	};

	function blockRender() {
		var ReactFitText = require("react-fittext");
		switch (block_type) {
			case "math":
				return (
					<Box fontSize={fontSize} minW="3xs" maxW={"50%"} margin={"auto"}>
						<ReactFitText>
							<TeX math={block_content} block />
						</ReactFitText>
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
					>
						{block_content}
					</SyntaxHighlighter>
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

	useEffect(() => {
		setIsFlipped(false);
	}, []);
	return (
		<Box
			h={["3xs", "3xs", "2xs", "2xs", "2xs", "sm"]}
			minH={"2xs"}
			maxH="sm"
			overflow="clip"
		>
			<ReactCardFlip isFlipped={full ? flipped : isFlipped}>
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
					overflowY="auto"
					onClick={cardClick}
				>
					<Box
						flexGrow="1"
						display={"flex"}
						justifyContent="center"
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
					<Box display={"inline-block"}>
						<Text
							isTruncated
							textOverflow="ellipsis"
							overflow={"hidden"}
							whiteSpace="nowrap"
						>
							Source/Link:{" "}
							<Untabbable>
								<Link display={"inline-block"} href={link} isExternal>
									{link}
								</Link>
							</Untabbable>
						</Text>
					</Box>
				</Box>

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
					overflowY="auto"
					onClick={cardClick}
				>
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
					<Box display={"inline-block"}>
						<Text
							isTruncated
							textOverflow="ellipsis"
							overflow={"hidden"}
							whiteSpace="nowrap"
						>
							Source/Link:{" "}
							<Untabbable>
								<Link href={link} isExternal>
									{link}
								</Link>
							</Untabbable>
						</Text>
					</Box>
				</Box>
			</ReactCardFlip>
		</Box>
	);
};

Card.defaultProps = {
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
