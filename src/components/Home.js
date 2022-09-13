import {
  Container,
  Heading,
  useColorModeValue,
  Text,
  Box,
  SimpleGrid,
  Img,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import React from "react";
import { colors } from "../values/colors";
import Spline from "@splinetool/react-spline";
import Calculator from "../assets/calculator.png";
import Code from "../assets/code.png";
import { Footer } from "./Footer/Footer";

export const Home = () => {
  return (
    <>
      <Container
        maxW="95vw"
        w={[
          "container.xl",
          "container.sm",
          "container.md",
          "container.lg",
          "container.xl",
        ]}
        pb={10}
        overflowX={"clip"}
        px="0"
      >
        <Box
          display={"flex"}
          justifyContent="center"
          alignItems="center"
          backgroundSize={"cover"}
          h={["50vh", "50vh", "80vh", "80vh"]}
        >
          <Box
            zIndex={10}
            position="absolute"
            textAlign={"center"}
            pb="5%"
            m="0"
          >
            <Heading size={"4xl"}>CardStack</Heading>
            <Heading as={"h4"} size="lg">
              Flashcards Supporting
            </Heading>
            <Heading as={"h4"} size="lg" color={colors.accent}>
              Latex and Code
            </Heading>
            <ButtonGroup my={3}>
              <Button
                size={"lg"}
                as="a"
                href="/signup"
                variant={"outline"}
                colorScheme="teal"
              >
                Get Started
              </Button>
              <Button size={"lg"} as="a" href="#about" variant={"outline"}>
                Learn More
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box backgroundSize={"cover"} pb={[1, 1, 10, 10, 10, 10, 10]} my="10">
          <Box textAlign={"center"} py={10} my={[0, 0, 10]}>
            <Heading> Powerfully Simple. </Heading>
            <Text fontSize={"1.25em"} textAlign={["left", "center"]} px={5}>
              {" "}
              Spend less time installing software and navigating through
              complicated UI.{" "}
            </Text>
          </Box>
          <SimpleGrid columns={[1, 1, 1, 2, 2, 2]} p={5} spacing="2" id="about">
            <Box p={[1, 1, 10, 10, 10, 10, 10]}>
              <Heading>Latex Support</Heading>
              <Text my={2} fontSize="1.25em" whiteSpace={"pre-wrap"}>
                CardStack uses Katex to display and support built-in latex
                functions. There aren't a lot of programs that support math.
                Although complex flashcard programs have latex support, the most
                popular ones don't. Cardstack aims to be a simpler alternative.
              </Text>
            </Box>
            <Box
              maxH={"100%"}
              overflow="clip"
              borderRadius={25}
              m={[1, 1, 1, 1, 1, 1, 10]}
              boxShadow="md"
            >
              <Img src={Calculator} />
            </Box>
          </SimpleGrid>
        </Box>
        <Box backgroundSize={"cover"} pb={[1, 1, 10, 10, 10, 10, 10]} my="10">
          <SimpleGrid columns={[1, 1, 1, 2, 2, 2]} p={5} spacing="2">
            <Box
              maxH={"100%"}
              overflow="clip"
              borderRadius={25}
              m={[1, 1, 1, 1, 1, 1, 10]}
              boxShadow="md"
            >
              <Img src={Code} />
            </Box>
            <Box p={[1, 1, 10, 10, 10, 10, 10]}>
              <Heading>Code Block Support</Heading>
              <Text my={2} fontSize="1.25em">
                On top of math support, code blocks are also rendered in
                CardStack flashcards. However, they don't have any functionality
                outside of the display. This feature is still unique to
                CardStack.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
        <Box
          backgroundSize={"cover"}
          py={10}
          m="10"
          flexDirection={"column"}
          display="flex"
          justifyContent="center"
          alignItems={"center"}
        >
          <SimpleGrid
            columns={[1, 2, 2]}
          >
            <Box >
              <Heading>Set up less, </Heading>
            </Box>
            <Box>
              <Heading> study more.</Heading>
            </Box>
          </SimpleGrid>
          <Button
            p={"5"}
            fontSize="1.25em"
            variant={"outline"}
            colorScheme="teal"
            borderWidth={"2px"}
            m={5}
            as="a"
            href="/signup"
          >
            {" "}
            Get Started
          </Button>
        </Box>

        <Footer/>
      </Container>
    </>
  );
};
