import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import {
  ChakraProvider,
  ColorModeScript,
  CSSReset,
  ThemeProvider,
} from "@chakra-ui/react";

import "./index.css";
import App from "./App";
import theme from "./theme";

ReactDOM.render(
  <ChakraProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <React.StrictMode>
          <CSSReset />
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ThemeProvider>
  </ChakraProvider>,
  document.getElementById("root")
)