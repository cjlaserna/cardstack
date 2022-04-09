import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  IconButton,
  Container,
  Stack,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Textarea,
  Text,
  Input,
  Box,
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
  Tooltip,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../backend/supabaseClient";
import { Formik, Field } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../backend/Auth";

export const Username = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const { signIn } = useAuth();
  const toast = useToast();
  const history = useNavigate();

  async function handleSubmit(values) {
    const { error } = await signIn({ email, password });
    if (error) {
      toast({
        title: "Error " + error.status,
        description:  (error.message === "Email not confirmed") ? "Please confirm your email. Then, come back to this page." : error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
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
        toast({
          title: "Error " + error.status,
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }

      history("/dashboard");
    }
  }

  window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ""; // Legacy method for cross browser support
      }
  };

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    } // add an else if null, ask for email and password
  }, [location]);
  return (
    <Box
      p={5}
      w="100%"
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems={"center"}
      h="80vh"
    >
      <Box w={["100%", "80%", "60%", "50%", "50%", "40%"]}>
        <Box m={5}>
          <Heading>Please set your username</Heading>
        </Box>

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
                  p="5"
                  bg={"gray.100"}
                  borderRadius="10"
                  display="flex"
                  flexDirection={"column"}
                  p="10"
                  w="100%"
                >
                  <FormLabel htmlFor="username">
                    Username
                    <Text fontSize={"xs"} color="red">
                      * required for sharing purposes
                    </Text>
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
                        error = "Username must contain at least 6 characters";
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
      </Box>
    </Box>
  );
};
