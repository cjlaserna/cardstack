import {
  Container,
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  InputGroup,
  InputRightElement,
  Input,
  Link,
} from "@chakra-ui/react";

import { useState } from "react";
import { useAuth } from "../backend/Auth";
import { useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";

export const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  // Get signUp function from the auth context
  const { signUp } = useAuth();

  const history = useNavigate();

  async function handleSubmit(values) {
    // Get email and password input values
    const email = values.email.toString();
    const password = values.password.toString();

    // Calls `signUp` function from the context
    const { error } = await signUp({ email, password });
    
    if (error) {
      toast({
        title: "Error " + error.status,
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Account Created",
        description: "Please confirm your email to proceed.",
        duration: 4000,
        isClosable: true,
      });

      console.log(email);
      console.log(password);
      
      history( "/username", {state: {email: email, password: password}});
    }
  }

  return (
    <Container
      w={"full"}
      maxW={" none"}
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
      flexDirection="row"
      h={"75vh"}
      overflow="clip"
    >
      <Box
        color="black"
        boxShadow="md"
        p="10"
        rounded="xl"
        backdropFilter="auto"
        backdropBlur="8px"
        backgroundColor={"white"}
        w={["100%", "80%", "50%", "40%", "30%", "25%"]}
      >
        <Heading>Signup</Heading>
        <Container mt={[5, 5, 5, 5, 5]} ml="0" p="0">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email" fontSize="sm" display={"none"}>
                      Email
                    </FormLabel>
                    <Field
                      as={Input}
                      placeholder="Email"
                      variant={"filled"}
                      _placeholder={{ color: "gray.300" }}
                      backgroundColor="gray.100"
                      py={5}
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
                  >
                    <FormLabel
                      htmlFor="password"
                      fontSize="sm"
                      display={"none"}
                    >
                      Password
                    </FormLabel>
                    <InputGroup size="md">
                      <Field
                        as={Input}
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        _placeholder={{ color: "gray.300" }}
                        backgroundColor="gray.100"
                        variant={"filled"}
                        name="password"
                        py={5}
                        id="password"
                        validate={(value) => {
                          let error;

                          if (value.length < 3) {
                            error =
                              "Password must contain at least 3 characters";
                          }

                          return error;
                        }}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {errors.password ? (
                      <FormErrorMessage color={"red.400"} display="block">
                        {errors.password}
                      </FormErrorMessage>
                    ) : (
                      ""
                    )}
                  </FormControl>

                  <FormControl textAlign={"right"} mt={5}>
                    <Link href="/login" _hover={{ textDecor: "none" }}>
                      <Button
                        variant={"ghost"}
                        colorScheme={"purple"}
                        color="purple.600"
                        mr={"1"}
                      >
                        Already have an account?
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      float="right"
                      variant={"outline"}
                      colorScheme="purple"
                      color={"purple.600"}
                    >
                      Register
                    </Button>
                  </FormControl>
                </VStack>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Container>
  );
};
