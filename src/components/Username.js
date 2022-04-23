import React, { useState, useEffect } from "react";
import {
  Button,
  useDisclosure,
  Text,
  Input,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { supabase } from "../backend/supabaseClient";
import { Formik, Field } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../backend/Auth";
import { m } from "framer-motion";

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
    console.log(email)
    console.log(password)
    if (error) {
      toast({
        title: "Error " + error.status,
        description: (error.message === "Email not confirmed") ? "Please confirm your email. Then, come back to this page." : error.message,
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

  const containerStyle = {
    backgroundColor: useColorModeValue("var(--chakra-colors-gray-100)", "#2a3347"),
    borderRadius: "10",
    display: "flex",
    flexDirection: "column",
    p: "10",
    w: "100%",
  }

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    } else {
      setEmail(null);
      setPassword(null);
      console.log(email);
      console.log(password);
    }
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


        <Box>
          <Formik
            initialValues={{
              email: "",
              password: "",
              username: "",
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={(email || password) ? 0: 4 } align="flex-start"  sx={containerStyle} mb='2'>
                  <FormControl
                    isInvalid={!!errors.email && touched.email}
                    sx={(email || password) ? { display: "none" } : {}}
                  >
                    <FormLabel>Email</FormLabel>
                    <Field
                      as={Input}
                      placeholder="Email"
                      variant={"flushed"}
                      borderBottomColor="gray.300"
                      id="email"
                      type="email"
                      name="email"
                      validate={(value) => {
                        let error;

                        if (!value) {
                          error = "* Required";
                        } else if (
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                            value
                          )
                        ) {
                          error = "Invalid email address";
                        }

                        return error;
                      }}
                    />
                    {errors.email ? (
                      <FormErrorMessage color={"red.400"} display="block">
                        {errors.email}
                      </FormErrorMessage>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                    sx={(email || password) ? { display: "none" } : {}}
                  >
                    <FormLabel>Password</FormLabel>
                    <Field
                      as={Input}
                      placeholder="Your Password"
                      variant={"flushed"}
                      borderBottomColor="gray.300"
                      id="password"
                      type="password"
                      name="password"
                      validate={(value) => {
                        let error;
                        if (!value) {
                          error = "* Required";
                        }
                        return error;
                      }}
                    />
                    {errors.password ? (
                      <FormErrorMessage color={"red.400"} display="block">
                        {errors.password}
                      </FormErrorMessage>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.username && touched.username}
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
                </VStack>
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
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
