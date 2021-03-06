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
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./Card Component/Card";
import { useAuth } from "../../backend/Auth";
import { supabase } from "../../backend/supabaseClient";
import {
  AddIcon,
  ArrowBackIcon,
  LinkIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import { colors } from "../../values/colors";
import { Share } from "./Share";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierSulphurpoolDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { languages, SupportedLang } from "./Card Component/SupportedLang";
import { Select } from "chakra-react-select";
import { CardLong } from "./Card Component/CardLong";
import { handleDel, SaveBtn } from "./Card Component/SaveBtn";
import { EditBtn } from "./Card Component/EditBtn";

export const Cardset = () => {
  // states & vars
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  const [cardStack, setCardStack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [selected, setSelIndex] = useState('plaintext');

  // toast
  const toast = useToast();

  // more states
  const [onDel, setOnDel] = useState(false);
  const [delItems, setDelItems] = useState([]);
  const [target, setTarget] = useState("");
  const [link, setLink] = useState("/");
  const [currBlock, setCurrBlock] = useState({
    blockType: "none",
    blockVal: "",
    blockLang: "plaintext"
  });

  // refs
  const inputRef = useRef();
  const frontRef = useRef();
  const backRef = useRef();
  // modals
  const {
    isOpen: isMathOpen,
    onOpen: onMathOpen,
    onClose: onMathClose,
  } = useDisclosure();
  const {
    isOpen: isCodeOpen,
    onOpen: onCodeOpen,
    onClose: onCodeClose,
  } = useDisclosure();
  const {
    isOpen: isImgOpen,
    onOpen: onImgOpen,
    onClose: onImgClose,
  } = useDisclosure();
  const {
    isOpen: isLinkOpen,
    onOpen: onLinkOpen,
    onClose: onLinkClose,
  } = useDisclosure();
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  // params
  const username = useParams().user;
  const setTitle = useParams().setname;

  // set target state
  const onChange = (e) => {
    e.preventDefault();
    setTarget(e.target.value);
  };

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

  // handle modal submits
  const onSubmitMath = () => {
    setCurrBlock({
      blockType: "math",
      blockVal: inputRef.current.value.toString(),
    });
    setTarget("");
    onMathClose();
  };

  const onSubmitCode = () => {
    setCurrBlock({
      blockType: "code",
      blockVal: inputRef.current.value.toString(),
      blockLang: selected
    });
    setTarget("");
    onCodeClose();
  };
  const onSubmitImg = () => {
    setCurrBlock({
      blockType: "image",
      blockVal: inputRef.current.value.toString(),
    });
    setTarget("");
    onImgClose();
  };

  const onSubmitLink = () => {
    setLink(inputRef.current.value.toString());
    onLinkClose();
  };

  //  del all
  const onRemoveBlocks = () => {
    setCurrBlock({
      blockType: "none",
      blockVal: null,
    });
  };

  // Block Preview Switch
  function blockRender() {
    switch (currBlock.blockType) {
      case "math":
        return (
          <Box fontSize={"2em"}>
            <TeX math={currBlock.blockVal} block />
          </Box>
        );
      case "code":
        return (
          <SyntaxHighlighter
            language={selected ? selected : 'plaintext'}
            wrapLongLines
            useInlineStyles
            customStyle={{
              padding: "var(--chakra-space-5)",
              borderRadius: "var(--chakra-space-5)"
            }}
            style={atelierSulphurpoolDark}
          >{currBlock.blockVal}</SyntaxHighlighter>
        );
      case "image":
        return (
          <Box h="300px" overflow="hidden">
            <Center w={"full"} overflow="hidden">
              <Image src={currBlock.blockVal} w="80%" isCentered />
            </Center>
          </Box>
        );
      default:
        return <></>;
    }
  }

  // add cards
  async function addCard() {
    let temp = cardData.cards.cards;
    temp.push({
      front: frontRef.current.value,
      back: backRef.current.value,
      block_type: currBlock.blockType,
      block_content: currBlock.blockVal,
      block_language: currBlock.blockLang,
      link: link,
    });

    const newCards = `{"cards":${JSON.stringify(temp)}}`;
    const newCardsObj = JSON.parse(newCards);

    const user = supabase.auth.user();

    try {
      let { error } = await supabase
        .from("cardsets")
        .update({ cards: newCardsObj })
        .eq("user_id", user.id)
        .eq("cardset_name", setTitle)
        .single();

      if (error) {
        throw error;
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

    onAddClose();
  }

  // delete cards given cards index array
  async function delCard(cards) {
    console.log(cards)
    const user = supabase.auth.user();
    let originalCards = cardData.cards.cards;
    let newCards = originalCards;
    let newObj;

    await cards.every((card) => {
      // deleting cards from the "starred list"
      let index = originalCards[card];
      handleDel(index, user, username, setTitle);

      newCards = newCards.filter(function (value, card) {
        return cards.indexOf(card) == -1;
      })
    })

    // new obj parsed and everything
    const newStr = `{"cards":${JSON.stringify(newCards)}}`;
    console.log(newStr);
    newObj = JSON.parse(`${newStr}`);

    // original object
    const match = `{"cards":${JSON.stringify(originalCards)}}`;
    const matchObj = JSON.parse(`${match}`);

    try {
      let { error } = await supabase
        .from("cardsets")
        .update({ cards: newObj })
        .eq("user_id", user.id)
        .eq("cardset_name", setTitle)
        .single();

      if (error) {
        throw error;
      } else {
        var newCardData = cardData
        newCardData.cards = newObj;
        setCardData(newCardData);
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

  // options
  const options = [...languages].map(function (language) {
    return {
      label: language.name,
      value: language.name,
    }
  });

  // prevent refresh while deleting
  window.onbeforeunload = (event) => {
    if (onDel === true) {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ""; // Legacy method for cross browser support
      }
      return ""; // Legacy method for cross browser support
    }
  };

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
    setOnDel(false);
    setDelItems([]);
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
      h={"auto"}
      pb={10}
      overflowX={"clip"}
    >
      {/* Top Half, headings, breadcrumbs, menus, etc.*/}
      {user ? (
        <Button
          colorScheme="blue"
          variant={"link"}
          aria-label="Go to Dashboard"
          size="sm"
          leftIcon={<ArrowBackIcon />}
          p="0"
          as="a"
          href="/dashboard"
        >
          Back to Dashboard
        </Button>
      ) : (
        ""
      )}

      <Skeleton isLoaded={!isLoading}>
        {cardData ? (
          <>
            <Box>
              {user ? (
                userID === user.id ? (
                  <Box display="inline-block" float={"right"} cursor="pointer">
                    <Tooltip label="Delete cards from set." placement="left">
                      <Box display={'inline-block'}>
                        <IconButton
                          aria-label="Delete a card set"
                          icon={<DeleteIcon />}
                          mx="1"
                          onClick={() => {
                            setOnDel(!onDel);
                            setDelItems([]);
                          }}
                          color={onDel ? "red" : ""}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label={onDel ? "Disabled." : "Add to this card set."}
                      placement="left"
                    >
                      <Box display={'inline-block'}>
                        <IconButton
                          aria-label="Add new card set"
                          icon={<AddIcon />}
                          disabled={onDel ? true : false}
                          mx={1}
                          onClick={() => {
                            onAddOpen();
                            setCurrBlock({
                              blockType: "none",
                              blockVal: "",
                            });
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <Heading mb={2}>
                {setTitle} by {username}
              </Heading>
              <Heading fontWeight={"normal"} size={"md"}>
                {cardData.cardset_desc}
              </Heading>
            </Box>

            <Box w={'full'} display='block' display='inline-block'>
              <HStack float={"right"}>
                <Button
                  colorScheme={"blue"}
                  href={`/cardset/${username}/${setTitle}/full`}
                  as="a"
                >
                  Study this set
                </Button>
                <Share />
              </HStack>
            </Box>
            {/* testing start*/}
            {
              (cardStack && cardStack.length !== 0) ? (
                <VStack spacing={3} pb={5}>
                  {
                    cardData.cards.cards.map((card, index) => (
                      <>
                        <Box w='full'>
                          <CardLong
                            front={card.front}
                            back={card.back}
                            link={card.link}
                            block_type={card.block_type}
                            block_content={card.block_content}
                            block_language={card.block_language}
                            key={index}
                          />
                          {onDel ? (
                            <Box mx={1}>
                              <Fade in={onDel}>
                                <Box
                                  float={"right"}
                                  display="flex"
                                  justifyContent={"center"}
                                >
                                  <Text display="inline" mx={"2"}>
                                    Delete Card?{" "}
                                  </Text>
                                  <Checkbox
                                    colorScheme="red"
                                    size={"lg"}
                                    _hover={{ color: "red", cursor: "pointer" }}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        let temp = delItems;
                                        temp.push(index);
                                        setDelItems(temp);
                                        console.log(delItems);
                                        console.log(index);
                                      } else if (!e.target.checked) {
                                        if (delItems.length === 1) {
                                          setDelItems([]);
                                        } else {
                                          let temp = delItems;
                                          temp.splice(index, 1);
                                          setDelItems(temp);
                                          console.log(temp);
                                        }
                                      } else {
                                        toast({
                                          title: "Site Error",
                                          description:
                                            "Refresh your page to fix this issue",
                                          status: "error",
                                          duration: 4000,
                                          isClosable: true,
                                        });
                                      }
                                    }}
                                  />
                                </Box>
                              </Fade>
                            </Box>
                          ) : (
                            user ? (
                              userID === user.id ? (
                                <Box
                                  float={"right"}
                                  display="flex"
                                  justifyContent={"center"}
                                  my={1}
                                >
                                  <HStack spacing={2}>
                                    <EditBtn card={card} cards={cardData.cards.cards} title={setTitle} />
                                    <SaveBtn card={card} setName={setTitle} setCreator={username} user={user} size={'sm'} />
                                  </HStack>
                                </Box>
                              ) : ''
                            ) : ''
                          )}
                        </Box>
                      </>
                    ))
                  }
                </VStack>
              ) :
                <Text fontSize={'1.25em'}>There are no cards in this set.</Text>
            }
          </>
        ) : (
          ""
        )}
      </Skeleton>

      {/* Modals */}
      <>
        <Modal isOpen={isAddOpen} onClose={onAddClose} size={"2xl"} isCentered>
          <ModalOverlay />
          <ModalContent w={"95vw"} p="3">
            <ModalHeader textAlign={"center"}>Add A Card</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Container w={"auto"} p="0">
                <>
                  <Box
                    boxShadow={"sm"}
                    w="100%"
                    overflow={"clip"}
                    className="prev"
                    py={2}
                  >
                    <Box display={"flex"} flexDir="column">
                      <Heading size={"md"} ml="1px" my={1}>
                        Front
                      </Heading>
                      <Textarea
                        display="inline"
                        px={"5px"}
                        mx="1px"
                        w="100%"
                        maxW="100%"
                        wordBreak={"break-word"}
                        overflow="wrap"
                        borderColor={colors.highlighter}
                        borderWidth="2px"
                        placeholder="Front Card Question"
                        my="1px"
                        ref={frontRef}
                        isRequired
                      />

                      <Heading size={"md"} ml="1px" my={1}>
                        Back
                      </Heading>
                      <Textarea
                        display="inline"
                        px={"5px"}
                        mx="1px"
                        w="100%"
                        maxW="100%"
                        wordBreak={"break-word"}
                        overflow="wrap"
                        borderColor={colors.highlighter}
                        borderWidth="2px"
                        placeholder="Back Card Answer"
                        my="1px"
                        ref={backRef}
                      />
                    </Box>
                    <Box my={"10px"}>{blockRender()}</Box>
                    <Link href={link} color="purple.400" my={"2px"} isExternal>
                      Source / Link
                    </Link>
                  </Box>
                </>

                <ButtonGroup w="100%">
                  <SimpleGrid
                    columns={[2, 3, 3, 3, 3, 3, 3]}
                    spacingX={2}
                    spacing={2}
                    my="3"
                  >
                    <Tooltip label="Add an Image.">
                      <Button variant={"solid"} px={3} onClick={onImgOpen}>
                        Image
                      </Button>
                    </Tooltip>
                    <Tooltip label="Add a Code Block.">
                      <Button variant={"solid"} px={3} onClick={onCodeOpen}>
                        Code Block
                      </Button>
                    </Tooltip>
                    <Tooltip label="Add a Math Block.">
                      <Button variant={"solid"} px={3} onClick={onMathOpen}>
                        Math Block
                      </Button>
                    </Tooltip>
                    <Tooltip label="Remove Special Blocks.">
                      <Button
                        variant={"solid"}
                        px={3}
                        onClick={onRemoveBlocks}
                        leftIcon={<DeleteIcon />}
                      >
                        Delete Block
                      </Button>
                    </Tooltip>
                    <Tooltip label="Change Link.">
                      <Button
                        variant={"solid"}
                        px={3}
                        onClick={onLinkOpen}
                        leftIcon={<LinkIcon />}
                      >
                        Link
                      </Button>
                    </Tooltip>
                    {/* <Button variant={"solid"} mr="2" px={3} onClick={(() => {console.log(target); console.log(currBlock)})}  >
           Test
          </Button> */}
                  </SimpleGrid>
                </ButtonGroup>
                <Button colorScheme="blue" float="right" onClick={addCard}>
                  Submit
                </Button>
              </Container>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>

      {/* Modals */}
      <Modal
        onClose={onMathClose}
        isOpen={isMathOpen}
        isCentered
        size={"md"}
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalCloseButton />
          <ModalHeader pb={"5px"}>Math Editor</ModalHeader>
          <ModalBody>
            <form>
              <Input
                ref={inputRef}
                size={"md"}
                mb="10px"
                autoComplete="off"
                onChange={onChange}
                placeholder="Enter a math problem."
                isRequired
              />
              <Text>Preview</Text>
              <Box h="5em" overflow={"auto"}>
                {target ? <TeX math={target} block /> : ""}
                <Link
                  display={"block"}
                  href="https://katex.org/docs/support_table.html"
                  target={"_blank"}
                  color={"purple.500"}
                >
                  Need Katex Help?
                </Link>
              </Box>
              <Button float="right" onClick={onSubmitMath}>
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        onClose={onCodeClose}
        isOpen={isCodeOpen}
        isCentered
        size={"md"}
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalCloseButton />
          <ModalHeader pb={"5px"}>Code Editor</ModalHeader>
          <ModalBody>
            <form>
              <Textarea
                ref={inputRef}
                size={"md"}
                mb="10px"
                autoComplete="off"
                onChange={onChange}
                placeholder="Enter your code here"
                isRequired
              />
              <Select
                placeholder="Select a language"
                id='langSelect'
                options={options}
                value={options.find(obj => obj.value === selected)}
                onChange={(e) => {
                  setSelIndex(e.label);
                }}
              >
              </Select>
              <Text>Preview</Text>
              <Box h="5em" overflow={"auto"}>
                {target ? (
                  <SyntaxHighlighter
                    language={selected ? selected : 'plaintext'}
                    wrapLongLines
                    useInlineStyles
                    customStyle={{
                      padding: "var(--chakra-space-5)",
                      borderRadius: "var(--chakra-space-5)"
                    }}
                    style={atelierSulphurpoolDark}
                  >{target}</SyntaxHighlighter>
                ) : (
                  ""
                )}
              </Box>
              <Button float="right" onClick={onSubmitCode}>
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        onClose={onImgClose}
        isOpen={isImgOpen}
        isCentered
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalCloseButton />
          <ModalHeader pb={"5px"}>Add Image</ModalHeader>
          <ModalBody>
            <form>
              <Input
                ref={inputRef}
                size={"md"}
                mb="10px"
                autoComplete="off"
                onChange={onChange}
                placeholder="Enter an Image URL"
                isRequired
              />
              <Text>Preview</Text>
              <Box h="5em" overflow={"auto"}>
                {target ? <Image src={target} w="50%" /> : ""}
              </Box>
              <Button float="right" onClick={onSubmitImg}>
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        onClose={onLinkClose}
        isOpen={isLinkOpen}
        isCentered
        size={"xs"}
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalCloseButton />
          <ModalHeader pb={"5px"}>Add Link</ModalHeader>
          <ModalBody>
            <form>
              <Input
                ref={inputRef}
                size={"md"}
                mb="10px"
                autoComplete="off"
                placeholder="Enter your own link"
                isRequired
              />
              <Button float="right" onClick={onSubmitLink}>
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDelOpen}
        onClose={onDelClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalContent>
          <ModalBody>
            <Text>
              {delItems.length !== 0
                ? "Are you sure you want to delete all " +
                delItems.length +
                " items?"
                : "No Items Selected"}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDelClose} mx="1">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await delCard(delItems);
                console.log(delItems);
                onDelClose();
                setOnDel(false);
                setDelItems([]);
              }}
              mx="1"
              colorScheme={"red"}
            >
              Delete All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {onDel ? (
        <Box
          bottom="20px"
          position="fixed"
          display={"flex"}
          justifyContent="center"
          w="inherit"
        >
          <ScaleFade initialScale={0.9} in={onDel}>
            <Button
              variant="solid"
              colorScheme="red"
              size={"lg"}
              leftIcon={<DeleteIcon />}
              onClick={onDelOpen}
            >
              Delete Selected Cards?
            </Button>
          </ScaleFade>
        </Box>
      ) : (
        ""
      )}
    </Container>
  );
};
