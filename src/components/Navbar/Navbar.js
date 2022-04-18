import React from "react";
import { useState } from "react";
import {
  Flex,
  Button,
  IconButton,
  Container,
  Stack,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerHeader,
  Alert,
  AlertIcon,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Colormodebtn } from "../ToggleColorMode/Colormodebtn";
import { useAuth } from "../../backend/Auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../backend/supabaseClient";
import { Formik, Field } from "formik";
import { InfoIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

export const Navbar = () => {
  const [display, changeDisplay] = useState("none");
  const { colorMode, toggleColorMode } = useColorMode()

  const { user, signOut } = useAuth();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isNotifOpen,
    onOpen: onNotifOpen,
    onClose: onNotifClose,
  } = useDisclosure();
  const btnRef = React.useRef();
  const history = useNavigate();
  const toast = useToast();

  async function handleSignOut() {
    // Ends user session
    await signOut();

    // Redirects the user to Login page
    history("/");
  }

  async function getProfile() {
    if (user != null) {
      try {
        const user = supabase.auth.user();
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user.id)
          .single();

        if (error && status === 406) {
          onModalOpen();
          return "none";
        } else {
          toast({
            title: "Username is already set.",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
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
  }

  async function handleSubmit(values) {
    try {
      const user = supabase.auth.user();
      const username = values.username.toString();
      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        throw error;
      } else {
        onModalClose();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container
      display="flex"
      justifyContent={"flex-end"}
      maxW="99vw"
      w="99vw"
      m="0"
      p="0"
    >
      <Flex>
        <Flex align="center">
          {/* Desktop */}
          <Flex display={["none", "none", "flex", "flex"]}>
            <Button
              href="/"
              as="a"
              variant="ghost"
              aria-label="Home"
              my={5}
              w="100%"
            >
              Home
            </Button>

            {user ? (
              <>
                <Button
                  href="/dashboard"
                  as="a"
                  variant="ghost"
                  aria-label="Home"
                  my={5}
                  w="100%"
                  px={6}
                >
                  Dashboard
                </Button>
                <IconButton
                  icon={<InfoIcon />}
                  my={5}
                  w="50%"
                  variant={"outline"}
                  ml={"1"}
                  onClick={onNotifOpen}
                  ref={btnRef}
                />
                <Button
                  href="/"
                  as="a"
                  colorScheme="purple"
                  variant={"outline"}
                  aria-label="Log Out"
                  onClick={handleSignOut}
                  my={5}
                  w="100%"
                  ml={"1"}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  href="/login"
                  as="a"
                  colorScheme="purple"
                  variant={"outline"}
                  aria-label="Login"
                  my={5}
                  w="100%"
                  mr={"5px"}
                  ml={"5px"}
                >
                  Login
                </Button>
                <Button
                  href="/signup"
                  as="a"
                  colorScheme="purple"
                  variant={"outline"}
                  aria-label="Sign Up"
                  my={5}
                  w="100%"
                >
                  Register
                </Button>
              </>
            )}
          </Flex>
          <Colormodebtn />
          {/* Mobile */}
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mt="2"
            mr={"2"}
            icon={<HamburgerIcon />}
            onClick={() => changeDisplay("flex")}
            display={["flex", "flex", "none", "none"]}
          />
        </Flex>
        {/* Mobile Content */}
        <Flex
          w="100vw"
          display={display}
          bgColor={colorMode === 'light' ? "gray.50" : 'gray.800'}
          zIndex={20}
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          overflowY="auto"
          flexDir="column"
        >
          <Flex justify="flex-end">
            <IconButton
              mt={"2"}
              mr={"2"}
              aria-label="Open Menu"
              size="lg"
              icon={<CloseIcon />}
              onClick={() => changeDisplay("none")}
            />
          </Flex>

          <Stack align={"center"} spacing="5">
            <Button as="a" href="/" variant="ghost" aria-label="Home" w="100%">
              Home
            </Button>
            {user ? (
              <>
                <Button
                  as="a"
                  href="/dashboard"
                  variant="ghost"
                  aria-label="Dashboard"
                  w="100%"
                >
                  Dashboard
                </Button>
                <Button
                  as="a"
                  href="/"
                  variant="ghost"
                  aria-label="Sign Out"
                  onClick={handleSignOut}
                  w="100%"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  as="a"
                  href="/login"
                  variant="ghost"
                  aria-label="Login"
                  w="100%"
                >
                  Login
                </Button>
                <Button
                  as="a"
                  href="/signup"
                  variant="ghost"
                  aria-label="signup"
                  w="100%"
                >
                  Signup
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>

      <Modal
        onClose={onModalClose}
        isOpen={isModalOpen}
        isCentered
        size={"md"}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalHeader pb={"5px"}>Set a Username</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                username: "",
              }}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="flex-start">
                    <FormControl
                      isInvalid={!!errors.username && touched.username}
                    >
                      <FormLabel htmlFor="username" fontSize="sm">
                        Username
                      </FormLabel>
                      <Field
                        as={Input}
                        placeholder="johnDoe2"
                        variant={"flushed"}
                        borderBottomColor="gray.300"
                        id="username"
                        type="username"
                        name="username"
                        validate={(value) => {
                          let error;

                          if (value.length < 5) {
                            error =
                              "Username must contain at least 6 characters";
                          } else if (value.toString().indexOf(" ") > 0) {
                            error = "Username can't have spaces.";
                          } else {
                            error = null;
                          }

                          return error;
                        }}
                      />
                      {errors.username ? (
                        <FormErrorMessage color={"red.400"} display="block">
                          {errors.username}
                        </FormErrorMessage>
                      ) : (
                        ""
                      )}
                    </FormControl>
                    <FormControl>
                      <Button
                        type="submit"
                        float={"right"}
                        variant={"outline"}
                        colorScheme="purple"
                        color={"purple.600"}
                      >
                        Set Username
                      </Button>
                    </FormControl>
                  </VStack>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={isNotifOpen}
        placement="right"
        onClose={onNotifClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Account Settings</DrawerHeader>
          <DrawerBody>
            <Tooltip label="This is required for most sharing purposes.">
              <Alert
                status="error"
                borderRadius={5}
                onClick={getProfile}
                cursor="pointer"
              >
                <AlertIcon />
                Set Your Username
              </Alert>
            </Tooltip>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onNotifClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};
