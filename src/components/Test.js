import React from "react";
import { useEffect, useState } from "react";

export const Test = () => {
  const [isOn, SetIsOn] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === " ") {
      console.log(isOn);
      onFlip();
    }
  };

  const onFlip = () => {
    SetIsOn(!isOn);
  };

  useEffect(() => {
    SetIsOn(false);
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removenEventListener("keydown", handleKeyPress);
  }, []);
  return <p>{isOn.toString()}</p>;
};
