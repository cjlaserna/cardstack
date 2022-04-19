import {
	Box,
	Container,
	Heading,
	Text,
	SimpleGrid,
	Skeleton,
	IconButton,
	Button,
	ButtonGroup,
	useToast,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	HStack,
	Progress,
	Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./Card Component/Card";

import { supabase } from "../../backend/supabaseClient";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import "katex/dist/katex.min.css";
import Slider from "react-slick";
import { Slider as RangeSlider } from "@chakra-ui/react";
import { Share } from "./Share";
import { SpeechBtn } from "./Card Component/SpeechBtn";
import { SaveBtn } from "./Card Component/SaveBtn";
import { useAuth } from "../../backend/Auth";

export const CardsetFull = () => {
	// states & vars
	const [cardData, setCardData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [userID, setUserID] = useState(null);
	const [fontSize, setFontSize] = useState("1.25em");
	const [cardStack, setCardStack] = useState(null);
	const [cardOriginal, setCardOriginal] = useState(null);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isFrontBackFlipped, setIsFrontBackFlipped] = useState(false);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	// toast
	const toast = useToast();

	// params
	const username = useParams().user;
	const setTitle = useParams().setname;

	// shuffle
	var shuffle = require("shuffle-array");

	// Refs
	const slider = useRef();

	// current user
	const { user } = useAuth();

	// fetch user
	async function fetchCardset() {
		try {
			let { data, error, status } = await supabase
				.from("profiles")
				.select(`id`)
				.eq("username", username)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUserID(data.id.toString(), setCards(data.id.toString()));
				console.log(userID);
			}
		} catch (error) {
			toast({
				title: "Error " + error.status,
				description: error.message,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	}

	// fetch cards from user
	async function setCards(user) {
		let { data: cardset, error } = await supabase
			.from("cardsets")
			.select("*")
			.eq("user_id", user)
			.eq("cardset_name", setTitle)
			.single();

		if (cardset) {
			setCardData(cardset);
			setCardStack(cardset.cards.cards);
			setCardOriginal(cardset.cards.cards);
			setIsLoading(false);
		}

		if (error) {
			toast({
				title: "Error " + error.status,
				description: error.message,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return cardset;
	}

	// handle slider range
	function handleSliderChange(value) {
		switch (value) {
			case 1:
				setFontSize("1.25em");
				break;
			case 2:
				setFontSize("2em");
				break;
			case 3:
				setFontSize("2.5em");
				break;

			default:
				setFontSize("1.25em");
		}
	}

	// shuffle cards
	function shuffleCards() {
		let object = cardStack;
		let arr = [];

		object.map((card) => {
			arr.push(card);
			return arr;
		});
		shuffle(arr);
		setCardStack(arr);
		setIsFlipped(isFrontBackFlipped);
		slider.current.slickGoTo(0);
		setCurrentCardIndex(0);
	}

	function resetCards() {
		setCardStack(cardOriginal);
		setIsFlipped(isFrontBackFlipped);
		slider.current.slickGoTo(0);
		setCurrentCardIndex(0);
	}

	// keyboard handling
	const handleKeyPress = (e) => {
		console.log("test");

		switch (e.key) {
			case "ArrowRight":
				handleSliderNext();
				break;
			case "ArrowLeft":
				handleSliderPrev();
				break;
			case " ":
				e.preventDefault();
				cardClick();
				break;
			default:
				return null;
		}
	};

	// handle slider prev
	const handleSliderPrev = (e) => {
		slider.current.slickPrev();
		setIsFlipped(isFrontBackFlipped);
	};

	// handle slider next
	const handleSliderNext = (e) => {
		slider.current.slickNext();
		setIsFlipped(isFrontBackFlipped);
	};

	// card click
	const cardClick = () => {
		setIsFlipped((prevState) => !prevState);
	};

	const switchFrontBack = () => {
		setIsFlipped(!isFrontBackFlipped);
		setIsFrontBackFlipped(!isFrontBackFlipped);
	};

	const getCurrCardInfo = () => {
		const card = cardStack[currentCardIndex];
		if (!isFlipped) {
			return card.front;
		} else if (isFlipped) {
			return card.back;
		} else {
			return "";
		}
	};

	const getProgress = () => {
		const progress = ((currentCardIndex + 1) / cardStack.length) * 100;
		console.log(progress);
		return progress;
	};
	// fetch cards once
	useEffect(() => {
		setIsLoading(true);
		fetchCardset();
		setIsFlipped(false);
		setCurrentCardIndex(0);
		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);
	return (
		<Container
			maxW="100vw"
			w={[
				"container.xl",
				"container.sm",
				"container.md",
				"container.lg",
				"container.xl",
			]}
			pb={10}
			overflowX={"clip"}
		>
			<Button
				colorScheme="blue"
				variant={"link"}
				aria-label="Go to Dashboard"
				size="sm"
				leftIcon={<ArrowBackIcon />}
				p="0"
				as="a"
				href={`/cardset/${username}/${setTitle}`}
			>
				View All Cards
			</Button>

			<Box h={"80vh"}>
				<Box px="5" position={"relative"} m="2" borderRadius={"10"}>
					<Box mx={2} my={2}>
						<Heading>
							{" "}
							{setTitle} by {username}{" "}
						</Heading>
					</Box>

					{cardStack ? (
						cardStack.length !== 0 ? (
							<>
								<SimpleGrid columns={2} w="full" minH={10} mx={2}>
									<Box h={10}>
										<Text fontWeight="medium"> Progress: </Text>
										<Progress value={getProgress()} />
									</Box>
									<HStack
										gap={"1px"}
										display={"flex"}
										justifyContent="flex-end"
									>
										<SpeechBtn text={getCurrCardInfo()} />
										{user ? (
											<SaveBtn
												card={cardStack[currentCardIndex]}
												setName={setTitle}
												setCreator={username}
												user={user}
											/>
										) : (
											""
										)}
										<Share />
									</HStack>
								</SimpleGrid>
								<Box w="100%" float={"left"}>
									<Box
										w={"100%"}
										position="relative"
										h="auto"
										mx={2}
										mt={2}
										overflow={"visible"}
									>
										<Skeleton isLoaded={!isLoading}>
											<Slider
												dots={false}
												infinite={true}
												accessibility
												speed="300"
												slidesToShow={1}
												slidesToScroll={1}
												arrows={false}
												maxH={"sm"}
												ref={slider}
												afterChange={(current) => setCurrentCardIndex(current)}
											>
												{cardStack.map((card, index) => (
													<Box>
														<Box onClick={cardClick}>
															<Card
																front={card.front}
																back={card.back}
																link={card.link}
																block_type={card.block_type}
																block_content={card.block_content}
																key={index}
																fontSize={fontSize}
																flipped={isFlipped}
																full={true}
															/>
														</Box>
													</Box>
												))}
											</Slider>
										</Skeleton>
										<Box my={2} w="full">
											<HStack
												w="full"
												display={"flex"}
												justifyContent="center"
												alignItems={"center"}
											>
												<IconButton
													icon={<ArrowBackIcon />}
													onClick={handleSliderPrev}
													display="inline"
												/>
												<Text
													flexGrow={1}
													textAlign="center"
													fontSize={"1.25em"}
												>
													{" "}
													{currentCardIndex + 1} / {cardStack.length}{" "}
												</Text>
												<IconButton
													icon={<ArrowForwardIcon />}
													onClick={handleSliderNext}
													display="inline"
												/>
											</HStack>
										</Box>
									</Box>
								</Box>
							</>
						) : (
							<>
								<Box minH={10} />
								<Box
									h={["3xs", "3xs", "2xs", "2xs", "2xs", "sm"]}
									minH={"2xs"}
									maxH="sm"
									display={"flex"}
									alignItems="center"
									justifyContent={"center"}
								>
									<Heading>No Cards</Heading>
								</Box>
							</>
						)
					) : (
						<>
							<Box minH={10} />
							<Box
								h={["3xs", "3xs", "2xs", "2xs", "2xs", "sm"]}
								minH={"2xs"}
								maxH="sm"
								display={"flex"}
								alignItems="center"
								justifyContent={"center"}
							>
								<Spinner size={'lg'}/>
							</Box>
						</>
					)}

					<Box w={"full"} pb={"2.5em"} mx="2">
						<ButtonGroup
							my={5}
							w={"full"}
							display="flex"
							justifyContent={"center"}
							alignItems="center"
						>
							<SimpleGrid
								columns={[1, 1, 1, 2, 2, 2]}
								spacingX={2}
								spacing={2}
								w="full"
							>
								<SimpleGrid columns={[1, 1, 2, 2, 2, 2, 2]} spacing={2} pt={5}>
									<Button
										colorScheme={"blue"}
										href={`/cardset/${username}/${setTitle}`}
										as="a"
									>
										View All Cards
									</Button>
									<Button
										colorScheme="blue"
										variant={isFrontBackFlipped ? "solid" : "outline"}
										onClick={switchFrontBack}
									>
										Switch Front and Back
									</Button>
									<Button
										colorScheme={"blue"}
										variant="outline"
										onClick={shuffleCards}
									>
										Shuffle Card Set
										{/* Doesnt work, bad, fix later */}
									</Button>
									<Button
										colorScheme={"blue"}
										variant="outline"
										onClick={resetCards}
									>
										Reset Shuffle
									</Button>
								</SimpleGrid>

								<Box w={"100%"} pt={5}>
									<Box float={"right"} mr={"25%"} w="50%">
										<Text>Change Font Size</Text>
										<RangeSlider
											defaultValue={1}
											min={1}
											max={3}
											step={1}
											onChange={(val) => handleSliderChange(val)}
										>
											<Box
												display={"flex"}
												alignItems="center"
												position={"relative"}
												bottom={"-2em"}
											>
												<SliderMark
													value={1}
													mt="1"
													ml="-2.5"
													fontSize="1.25em"
												>
													A
												</SliderMark>
												<SliderMark value={2} mt="1" ml="-2.5" fontSize="2em">
													A
												</SliderMark>
												<SliderMark value={3} mt="1" ml="-2.5" fontSize="2.5em">
													A
												</SliderMark>
											</Box>
											<SliderTrack bg="blue.100">
												<Box position="relative" right={10} />
												<SliderFilledTrack bg="teal" />
											</SliderTrack>
											<SliderThumb boxSize={6} />
										</RangeSlider>
									</Box>
								</Box>
							</SimpleGrid>
						</ButtonGroup>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};
