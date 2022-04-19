import { AddIcon, DeleteIcon, } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  Button,
  Input,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Modal,
  useDisclosure,
  FormControl,
  Tooltip,
  Textarea,
  FormErrorMessage,
  VStack,
  useToast,
  Skeleton,
  Checkbox,
  ScaleFade,
  ModalFooter,
  Collapse,
  useMediaQuery,
  FormHelperText,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { CardsetBox } from "./FlashcardComponents/CardsetBox";
import { useAuth } from "../backend/Auth";
import { supabase } from "../backend/supabaseClient";

export const Dashboard = () => {
  // states
  const [cardsets, setCardsets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onDel, setOnDel] = useState(false);
  const [username, setUsername] = useState(null);
  const [delItems, setDelItems] = useState([]);

  // vars
  const toast = useToast();
  const { user } = useAuth();

  // modal disclosures
  const {
    isOpen: isCardSetOpen,
    onOpen: onCardSetOpen,
    onClose: onCardSetClose,
  } = useDisclosure();

  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();

  // media query
  const [isSmallerThan767] = useMediaQuery("(max-width: 767px)");

  // fetch user cardsets
  async function fetchCardsets() {
    let { data: cardsets, error } = await supabase
      .from("cardsets")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) console.log("error", error);
    return cardsets;
  }

  function checkName(name) {
    let setNames = [];
    cardsets.map((cardset) => {
      setNames.push(cardset.cardset_name);
    });
    return setNames.includes(name);
  }

  // create new cardset
  async function onSubmitCardSet(values) {
    const name = values.cardsetName.toString();
    const desc = values.cardsetDesc.toString();

    // empty card set
    const test = `{"cards":[]}`;
    const testobj = JSON.parse(test);

    if (!checkName(name)) {
      let { data: cardSet, error } = await supabase
        .from("cardsets")
        .insert({
          user_id: user.id,
          cardset_name: name,
          cardset_desc: desc,
          cards: testobj,
        })
        .single();
      if (error) console.log(error);
      else {
        console.log(error);
      }

      console.log(name);
      console.log(desc);
      onCardSetClose();
      setIsLoading(true);
      fetchCardsets().then(function (result) {
        setCardsets(result);
        setIsLoading(false);
      });
    } else {
      toast({
        title: "Unique Name Error",
        description: "Card set names must be unique.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  // remove cardset given id
  async function removeCardSet(id) {
    let setNames = [];
    let temp = cardsets;
    // create a temporary cardset clone to alter

    cardsets.map((cardset) => {
      setNames.push(cardset.cardset_name);
    });

    let name = setNames[id];

    const { data, error } = await supabase
      .from("cardsets")
      .delete()
      .eq("cardset_name", name);

    if (error) {
      console.log("error", error);
    } else {
      if (id !== -1) {
        temp.splice(id, 1);
      }
      setCardsets(temp);
      window.location.reload(false);
    }
  }

  // get user
  async function getProfile() {
    try {
      const user = supabase.auth.user();
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(
          data.username,
          fetchCardsets().then(function (result) {
            setCardsets(result);
            setIsLoading(false);
          })
        );
      }
    } catch (error) {
      toast({
        title: "Error " + error.status,
        description: error.message,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  }

  // prevent refresh while deleting
  window.onbeforeunload = (event) => {
    if (onDel === true) {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ""; // Legacy method for cross browser support
      }
      return "";
    }
  };

  // use effect
  useEffect(() => {
    setOnDel(false);
    setIsLoading(true);
    getProfile();
  }, []);
  return (
    <>
      {/* Main Content */}
      <Container
        maxW="100vw"
        w={[
          "container.xl",
          "container.sm",
          "container.md",
          "container.lg",
          "container.xl",
        ]}
      >
        <Box display="block">
          <Heading>Dashboard</Heading>
          <Text>Create and manage card sets in your dashboard.</Text>
        </Box>
        <Box w={"full"} display="flex" justifyContent="flex-end" py={2}>
          <Tooltip label="Delete a card set" placement="left">
            <Box>
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
          <Tooltip label="Add new card set" placement="left">
            <Box>
              <IconButton
                aria-label="Add new card set"
                icon={<AddIcon />}
                onClick={onCardSetOpen}
                disabled={onDel ? true : false}
                mx="1"
              />
            </Box>
          </Tooltip>
        </Box>
        <Skeleton isLoaded={!isLoading}>
          <SimpleGrid columns={[1, 1, 2, 4]} spacing={5}>
            {cardsets.length > 0 ? (
              <>
                {cardsets.map((cardset, index) => (
                  <Skeleton isLoaded={!isLoading}>
                    <CardsetBox
                      cardsetName={cardset.cardset_name}
                      cardsetDesc={cardset.cardset_desc}
                      username={username}
                      key={index}
                    />
                    {onDel ? (
                      <Box m={1}>
                        <Collapse in={onDel} animateOpacity>
                          <Box
                            float={"right"}
                            display="flex"
                            justifyContent={"center"}
                          >
                            <Text display="inline" mx={"2"}>
                              Delete Card Set?{" "}
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
                        </Collapse>
                      </Box>
                    ) : (
                      ""
                    )}
                  </Skeleton>
                ))}
              </>
            ) : (
              <Text fontSize={"1.25em"}>You have no cardsets.</Text>
            )}
          </SimpleGrid>
        </Skeleton>

        {/* Modals */}
        <Modal
          onClose={onCardSetClose}
          isOpen={isCardSetOpen}
          isCentered
          size={"md"}
        >
          <ModalOverlay />
          <ModalContent p="10px" w={"95vw"}>
            <ModalCloseButton />
            <ModalHeader pb={"5px"}>Add New Card Set</ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{
                  cardsetName: "",
                  cardsetDesc: "",
                }}
                onSubmit={(values) => {
                  onSubmitCardSet(values);
                  onCardSetClose();
                }}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={"10px"} align="flex-start">
                      <FormControl
                        isInvalid={!!errors.cardsetName && touched.cardsetName}
                      >
                        <Field
                          as={Input}
                          size={"md"}
                          placeholder="Enter Card Set Name"
                          isRequired
                          id="cardsetName"
                          type="cardsetName"
                          name="cardsetName"
                          maxLength="30"
                          autoComplete="off"
                          validate={(value) => {
                            let error;
                            console.log(
                              /@[a-zA-Z\s.\$_+!*',()-]/gm.test(value)
                            );
                            if (value.length < 3) {
                              error =
                                "Set name must be between 3-30 characters";
                            }

                            if (!/^[a-zA-Z\s.\$_+!*',()-]*$/gm.test(value)) {
                              console.log(value);
                              error =
                                "Invalid character(s): [ ] { } |  ” % ~ # < > ";
                            }

                            return error;
                          }}
                        />
                        {errors.cardsetName ? (
                          <FormErrorMessage
                            color={"red.400"}
                            display="block"
                            m={0}
                            p="0"
                          >
                            {errors.cardsetName}
                          </FormErrorMessage>
                        ) : (
                          ""
                        )}
                      </FormControl>

                      <FormControl>
                        <Box mb="10px">
                          <Field
                            as={Textarea}
                            size={"md"}
                            rows={5}
                            h="auto"
                            placeholder="Card Set Description (optional)"
                            id="cardsetDesc"
                            type="cardsetDesc"
                            name="cardsetDesc"
                            isRequired={false}
                            maxLength="150"
                          />
                          <FormHelperText p={0} m={0}>Max: 150 Characters</FormHelperText>
                        </Box>
                        <Button float="right" type="submit">
                          Submit
                        </Button>
                      </FormControl>
                    </VStack>
                  </form>
                )}
              </Formik>
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
                onClick={() => {
                  delItems.every(removeCardSet);
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

        {/* Delete All Btn */}
        {onDel ? (
          <Box
            bottom="20px"
            position="fixed"
            display={"flex"}
            justifyContent="center"
            w={isSmallerThan767 ? "unset" : "inherit"}
            left={isSmallerThan767 ? "3" : "unset"}
          >
            <ScaleFade initialScale={0.9} in={onDel}>
              <Button
                variant="solid"
                colorScheme="red"
                size={"lg"}
                leftIcon={<DeleteIcon />}
                onClick={onDelOpen}
              >
                Delete Selected Card Sets?
              </Button>
            </ScaleFade>
          </Box>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};
