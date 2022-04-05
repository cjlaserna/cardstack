import {
  Container,
  Heading,
  Stack,
  useColorModeValue,
  Text,
  Box,
  AspectRatio,
  SimpleGrid,
  Img,
  Button,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { LovingDoodle } from "react-open-doodles";
import { colors } from "../values/colors";
import Spline from "@splinetool/react-spline";
import Calculator from "../assets/calculator.png";
import Code from "../assets/code.png";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const Home = () => {
  const ink = useColorModeValue("black", "#d3d4e2");
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
              Flashcards Supporting{" "}
            </Heading>
            <Heading as={"h4"} size="lg" color={colors.accent} display="inline">
              Latex and Code
            </Heading>
          </Box>
          <Box overflow={"clip"}>
          <Spline scene="https://prod.spline.design/ga3gtDxsya9ng8w3/scene.spline" />
          </Box>
        </Box>
        <Box backgroundSize={"cover"} pb={[1,1,10,10,10,10,10]} m="0">
          <SimpleGrid columns={[1, 1, 1, 2, 2, 2]} p={5} spacing="2">
            <Box p={[1,1,10,10,10,10,10]}>
              <Heading>Latex Support</Heading>
              <Text my={2} fontSize="1.25em" whiteSpace={"pre-wrap"}>
                CardStack uses Katex to display and support built-in latex
                functions. There aren't a lot of flashcard programs that support
                math. Although more complex flashcard programs have latex
                support, the most popular and simpler ones don't. Cardstack aims
                to be a simpler alternative to these complex programs.
                <br />
                <br />
                In the future, there will be a more accessible math keyboard for
                everyone's ease of use
              </Text>
            </Box>
            <Box
              maxH={"100%"}
              overflow="clip"
              borderRadius={25}
              m={[1,1,1,1,1,1,10]}
              boxShadow="md"
            >
              <Img src={Calculator} />
            </Box>
          </SimpleGrid>
        </Box>
        <Box backgroundSize={"cover"} pb={[1,1,10,10,10,10,10]}  m="0" >
          <SimpleGrid columns={[1, 1, 1, 2, 2, 2]} p={5} spacing="2">
            <Box
              maxH={"100%"}
              overflow="clip"
              borderRadius={25}
              m={[1,1,1,1,1,1,10]}
              boxShadow="md"
            >
              <Img src={Code} />
            </Box>
            <Box p={[1,1,10,10,10,10,10]}>
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
        <Box backgroundSize={"cover"} py={20} m="0" flexDirection={'column'} display='flex' justifyContent='center' alignItems={'center'}>
          <Heading>No Subcriptions, No Payments</Heading>
          <Button p={'10'} fontSize='2em' variant={'outline'} colorScheme='teal' borderWidth={'2px'} m={5} as='a' href="/signup"> Get Started</Button>
        </Box>

        <Box backgroundSize={"cover"} pt={20} m="0" flexDirection={'column'} display='flex' justifyContent='center' alignItems={'center'}>
          <Heading size={'md'}> Made By <Link href="https://cjlaserna.github.io" isExternal>Catherine Laserna</Link> <ExternalLinkIcon/></Heading> 
        </Box>
      </Container>
    </>
  );
};
