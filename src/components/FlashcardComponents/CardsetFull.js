import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Skeleton,
  IconButton,
  Button,
  Link,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ButtonGroup,
  Img,
  Input,
  Textarea,
  Image,
  Code,
  Center,
  Checkbox,
  useToast,
  ScaleFade,
  Fade,
  HStack,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./Card";
import { useAuth } from "../../backend/Auth";
import { supabase } from "../../backend/supabaseClient";
import {
  AddIcon,
  ArrowBackIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EditIcon,
  LinkIcon,
  DeleteIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import { colors } from "../../values/colors";
import Slider from "react-slick";
import { Slider as RangeSlider } from "@chakra-ui/react";

export const CardsetFull = () => {
  // states & vars
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [slider, setSlider] = useState(null);
  const [fontSize, setFontSize] = useState("1.25em");
  const [cardStack, setCardStack] = useState(null);
  const [cardOriginal, setCardOriginal] = useState(null);

  // toast
  const toast = useToast();

  // params
  const username = useParams().user;
  const setTitle = useParams().setname;

  // shuffle
  var shuffle = require("shuffle-array");

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
    });
    shuffle(arr);
    setCardStack(arr);
    console.log(cardStack);
    console.log(arr);
  }

  function resetCards(){
    setCardStack(cardOriginal);
    console.log(cardOriginal);
  }

  // share card set
  function copyCardSetLink() {
    navigator.clipboard.writeText(window.location.href.toString());
    toast({
      title: "Link Copied",
      status: "success",
      duration: "1000",
      isClosable: true,
    });
  }

  // fetch cards once
  useEffect(() => {
    setIsLoading(true);
    fetchCardset();
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
      <Box h={"80vh"}>
        <Box
          p="5"
          top="8%"
          position={"relative"}
          boxShadow={"md"}
          m="2"
          borderRadius={"10"}
        >
          <Skeleton isLoaded={!isLoading}>
            {cardStack ? (
              <Box w="100%" float={"left"}>
                <Box
                  w={"100%"}
                  position="relative"
                  h="auto"
                  mx={2}
                  mt={2}
                  overflow={"visible"}
                >
                  <Slider
                    dots={false}
                    infinite={true}
                    accessibility
                    speed="300"
                    slidesToShow={1}
                    slidesToScroll={1}
                    arrows={false}
                    maxH={"sm"}
                    ref={(slider) => setSlider(slider)}
                  >
                    {cardStack.map((card, index) => (
                      <Box>
                        <Card
                          front={card.front}
                          back={card.back}
                          link={card.link}
                          block_type={card.block_type}
                          block_content={card.block_content}
                          key={index}
                          fontSize={fontSize}
                        />
                      </Box>
                    ))}
                  </Slider>
                  <Box my={1}>
                    <IconButton
                      icon={<ArrowForwardIcon />}
                      onClick={() => slider.slickNext()}
                      display="inline"
                      float={"right"}
                    />
                    <IconButton
                      icon={<ArrowBackIcon />}
                      onClick={() => slider.slickPrev()}
                      display="inline"
                      float={"left"}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              " No Cards"
            )}
          </Skeleton>

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
                <SimpleGrid
                  columns={[1, 1, 2, 2, 2, 2, 2]}
                  spacing={2}
                  pt={5}
                >
                  <Button
                    colorScheme={"blue"}
                    href={`/cardset/${username}/${setTitle}`}
                    as="a"
                  >
                    View this Card Set
                  </Button>
                  <Button
                    colorScheme={"blue"}
                    variant="outline"
                    onClick={copyCardSetLink}
                  >
                    Share this Card Set
                  </Button>
                  <Button
                    colorScheme={"blue"}
                    variant="outline"
                    onClick={shuffleCards}
                  >
                    Shuffle Card Set
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
