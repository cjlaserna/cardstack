import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";

export const CustomNextArrow = ({ className, style, onClick }) => {
  return (
    <IconButton
      icon={<ArrowForwardIcon />}
      onClick={onClick}
      display='inline'
    />
  );
};
export const CustomPrevArrow = ({ className, style, onClick }) => {
  return (
    <IconButton
      icon={<ArrowBackIcon />}
      onClick={onClick}
      display='inline'
    />
  );
};
