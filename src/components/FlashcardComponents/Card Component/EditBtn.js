import { EditIcon, LinkIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    IconButton,
    Button,
    Link,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ButtonGroup,
    Input,
    Textarea,
    Image,
    Center,
    useToast
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import { colors } from "../../../values/colors";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierSulphurpoolDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { languages, SupportedLang } from "./SupportedLang";
import { Select } from "chakra-react-select";
import { supabase } from '../../../backend/supabaseClient';

export const EditBtn = ({ card, cards, title }) => {

    const user = supabase.auth.user(); 

    // states & vars
    const originalCard = card;
    var originalStack = [];
    cards.map((card) => {
        originalStack.push(card);
    });

    // to use later
    const link = card.link;
    const back = card.back;
    const front = card.front;
    const block_type = card.block_type;
    const block_content = card.block_content;
    const block_language = card.block_language ? card.block_language : 'plaintext';

    // states
    const [selected, setSelIndex] = useState(block_language);

    // toast
    const toast = useToast();

    // more states
    const [target, setTarget] = useState("");
    const [currLink, setCurrLink] = useState(link);
    const [currBlock, setCurrBlock] = useState({
        blockType: block_type,
        blockVal: block_content,
        blockLang: block_language
    });

    // refs
    const inputRef = useRef();
    const frontRef = useRef();
    const backRef = useRef();

    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose
    } = useDisclosure();

    const {
        isOpen: isImgOpen,
        onOpen: onImgOpen,
        onClose: onImgClose
    } = useDisclosure();
    const {
        isOpen: isCodeOpen,
        onOpen: onCodeOpen,
        onClose: onCodeClose
    } = useDisclosure();
    const {
        isOpen: isMathOpen,
        onOpen: onMathOpen,
        onClose: onMathClose
    } = useDisclosure();
    const {
        isOpen: isLinkOpen,
        onOpen: onLinkOpen,
        onClose: onLinkClose
    } = useDisclosure();

    // set target state
    const onChange = (e) => {
        e.preventDefault();
        setTarget(e.target.value);
    };

    // options
    const options = [...languages].map(function (language) {
        return {
            label: language.name,
            value: language.name,
        }
    });

    // on submit
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
        setCurrLink(inputRef.current.value.toString());
        onLinkClose();
    };

    //  del all
    const onRemoveBlocks = () => {
        setCurrBlock({
            blockType: "none",
            blockVal: null,
        });
    };

    // render block
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
    // change card
    async function editSubmit() {
        const x = originalStack.findIndex((element) => element === originalCard);
        var temp = originalStack;
        temp[x].back = backRef.current.value;
        temp[x].front = frontRef.current.value;
        temp[x].block_content = currBlock.blockVal;
        temp[x].block_type = currBlock.blockType;
        temp[x].block_language = currBlock.blockLang;
        temp = JSON.stringify(temp);
        console.log(temp);

        const newCards = `{"cards":${temp}}`;
        const newCardsObj = JSON.parse(newCards);

        try {
            let { error } = await supabase
                .from("cardsets")
                .update({ cards: newCardsObj })
                .eq("user_id", user.id)
                .eq("cardset_name", title)
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
        window.location.reload(false);
    }
    return (
        <>
            <IconButton icon={<EditIcon />} size='sm' onClick={onAddOpen} />

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
                                            defaultValue={front}
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
                                            defaultValue={back}
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
                                </SimpleGrid>
                            </ButtonGroup>
                            <Button colorScheme="blue" float="right" onClick={editSubmit}>
                                Submit
                            </Button>
                        </Container>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* smaller modals */}
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
                                defaultValue={(currBlock.blockType === 'math') ? currBlock.blockVal : ''}
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
                                defaultValue={(currBlock.blockType === 'code') ? currBlock.blockVal : ''}
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
                                defaultValue={(currBlock.blockType === 'image') ? currBlock.blockVal : ''}
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
        </>
    )
}