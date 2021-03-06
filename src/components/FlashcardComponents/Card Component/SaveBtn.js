import {
	Fade,
	IconButton,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { supabase } from "../../../backend/supabaseClient";

export async function fetchStarred(user, setName, setCreator) {
	let { data: starred, error } = await supabase
		.from("starred")
		.select("*")
		.eq("user_id", user.id)
		.eq("cardset_name", setName)
		.eq("cardset_creator", setCreator)
		.single();

	if (error) {
		return null;
	} else {
		return starred.cards.cards;
	}
}

export async function handleDel(card, user, setCreator, setName) {
	// check if the card is already starred
	var arr = [];
	var starred = await fetchStarred(user, setName, setCreator);
	starred.map((card) => {
		arr.push(JSON.stringify(card));
	});
	const isCardInSet = arr.includes(JSON.stringify(card));
	console.log(isCardInSet);
	console.log(JSON.stringify(card));
	console.log(arr);
	if (isCardInSet) {
		// if card is starred, unstar card
		var arr = [];
		var stringArr = [];
		console.log(starred)
		starred.map((card) => {
			arr.push(card);
			stringArr.push(JSON.stringify(card));
			return arr;
		});

		arr.splice(stringArr.indexOf(JSON.stringify(card)), 1);
		const cards = `{"cards": ${JSON.stringify(arr)}}`;
		const cardsObj = JSON.parse(cards);

		try {
			let { error } = await supabase
				.from("starred")
				.update({ cards: cardsObj })
				.eq("user_id", user.id)
				.eq("cardset_creator", setCreator)
				.eq("cardset_name", setName)
				.single();

			if (error) {
				throw error;
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export const SaveBtn = ({ card, setName, setCreator, user, size, onDel }) => {
	// states
	const [starred, setStarred] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// chakra stuff lola
	const toast = useToast();
	const ink = useColorModeValue("gray", "lightgray");

	async function starCard() {
		setStarred(await fetchStarred(user, setName, setCreator));
		// if there are cards starred, fetch cards, add to it, send back new cards
		if (starred !== null) {
			// check if the card is already starred
			const isCardInSet = checkIfStarred();

			if (isCardInSet) {
				// if card is starred, unstar card
				var arr = [];
				var stringArr = [];
				console.log(starred)
				starred.map((card) => {
					arr.push(card);
					stringArr.push(JSON.stringify(card));
					return arr;
				});

				arr.splice(stringArr.indexOf(JSON.stringify(card)), 1);
				const cards = `{"cards": ${JSON.stringify(arr)}}`;
				const cardsObj = JSON.parse(cards);

				try {
					let { error } = await supabase
						.from("starred")
						.update({ cards: cardsObj })
						.eq("user_id", user.id)
						.eq("cardset_creator", setCreator)
						.eq("cardset_name", setName)
						.single();

					if (error) {
						throw error;
					} else {
						setStarred(cardsObj.cards);
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
			} else {
				// if card is not starred, star card
				var arr = [];
				console.log(starred)
				starred.map((card) => {
					arr.push(card);
					return arr;
				});

				// add to array
				arr.push(card);

				const cards = `{"cards": ${JSON.stringify(arr)}}`;
				const cardsObj = JSON.parse(cards);

				try {
					let { error } = await supabase
						.from("starred")
						.update({ cards: cardsObj })
						.eq("user_id", user.id)
						.eq("cardset_creator", setCreator)
						.eq("cardset_name", setName)
						.single();

					if (error) {
						throw error;
					} else {
						setStarred(cardsObj.cards);
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
		} else {
			// if there are no cards starred, create a new row
			const cards = `{"cards": [${JSON.stringify(card)}]}`;
			const cardsObj = JSON.parse(cards);

			let { data: starredCards, error } = await supabase
				.from("starred")
				.insert({
					user_id: user.id,
					cardset_name: setName,
					cardset_creator: setCreator,
					cards: cardsObj,
				})
				.single();
			if (error) console.log(error);
			else {
				console.log(error);
			}
			setStarred(cardsObj.cards);
		}
	}

	// check if card is in starred
	const checkIfStarred = () => {
		var arr = [];
		starred.map((card) => {
			arr.push(JSON.stringify(card));
		});
		return arr.includes(JSON.stringify(card));
	};

	useEffect(() => {
		setIsLoading(true);
		fetchStarred(user, setName, setCreator).then((value) => {
			setStarred(value);
			setIsLoading(false);
		});
	}, []);
	return (
		<>
			{isLoading ? (
				<IconButton isLoading size={size} />
			) : (
				<IconButton
					icon={<IoIosStar color={starred ? checkIfStarred() ? "#f4bd55" : ink : ink} />}
					onClick={starCard}
					size={size}
				/>
			)}
		</>
	);
};

SaveBtn.defaultProps = {
	card: null,
	setName: "Empty",
	setCreator: undefined,
	user: undefined,
	size: 'md',
	onDel: false
};
