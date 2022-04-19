import { IconButton, createIcon, Box } from '@chakra-ui/react'
import React from 'react'
import { IoIosVolumeHigh } from "react-icons/io";
import { useSpeechSynthesis } from "react-speech-kit";

export const SpeechBtn = ({text}) => {
  const { speak } = useSpeechSynthesis();

  return (
    <IconButton icon={<IoIosVolumeHigh/>} onClick={() => speak({ text: text })}/>
  )
}
