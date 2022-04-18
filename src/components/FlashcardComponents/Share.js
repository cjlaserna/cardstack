import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	useToast,
	Input,
	Box,
	IconButton,
	HStack,
	VStack,
	useDisclosure,
	createIcon,
	FormControl,
	FormLabel,
} from "@chakra-ui/react";
import emailjs from "@emailjs/browser";
import { Field, Formik } from "formik";

export const ShareIcon = createIcon({
	displayName: "ShareIcon",
	viewBox: "0 0 24 24",
	d: "M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z",
});

export const Share = ({ username, setTitle }) => {
	// chakra stuff lol
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// tokens
	const SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
	const TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;
	const PUBLIC_KEY = process.env.REACT_APP_USER_ID;

	// share data for share window
	const shareData = {
		title: setTitle,
		text: `Check out this card set shared by ${username}`,
		url: window.location.href.toString(),
	};

	// emailjs send form
	const sendEmail = (values) => {
		// params
		const templateParams = {
			username: username,
			cardset_link: window.location.href.toString(),
			reply_to: values.email.toString(),
		};

		emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
			(response) => {
				toast({
					title: "Email Sent",
					description: "Your email was sent successfully.",
					status: "success",
					duration: 1000,
					isClosable: true,
				});
			},
			(err) => {
				toast({
					title: "Error" + err,
					description: "Your email failed to send",
					status: "error",
					duration: 1000,
					isClosable: true,
				});
			}
		);
	};

	// on share (navigator share)
	const onShare = () => {
		try {
			navigator.share(shareData);
		} catch (err) {
			toast({
				title: "Error" + err,
				description: "There was an error bringing up the share menu.",
				status: "error",
				duration: 1000,
				isClosable: true,
			});
		}
	};

	// copy card set link
	function copyCardSetLink() {
		navigator.clipboard.writeText(window.location.href.toString());
		toast({
			title: "Link Copied",
			status: "success",
			duration: "1000",
			isClosable: true,
		});
	}

	return (
		<>
			<IconButton
				icon={<ShareIcon />}
				aria-label="Share cardset"
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={"center"}>Share this set</ModalHeader>
					<ModalCloseButton />
					<ModalBody mx={2} mb={5}>
						<Box w={"full"}>
							<VStack>
								<Box w={"full"}>
									<Formik
										initialValues={{
											email: "",
										}}
										onSubmit={(values) => {
											sendEmail(values);
										}}
									>
										{({ handleSubmit, errors, touched }) => (
											<form onSubmit={handleSubmit}>
												<FormControl
													isInvalid={!!errors.email && touched.email}
												>
													<FormLabel
														htmlFor="input-email"
														fontSize="sm"
														display={"none"}
													>
														Email
													</FormLabel>

													<HStack w="full">
														<Field
															as={Input}
															placeholder="Send to a friend's email"
															name="email"
															id="input-email"
															type="email"
															isRequired
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
														<Button type="submit">Send</Button>
													</HStack>
												</FormControl>
											</form>
										)}
									</Formik>
								</Box>
								<HStack w={"full"}>
									<Input value={window.location.href.toString()} />
									<Button onClick={copyCardSetLink}>Copy</Button>
								</HStack>
								<Button onClick={onShare} w={"full"}>
									{" "}
									Share{" "}
								</Button>
							</VStack>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
