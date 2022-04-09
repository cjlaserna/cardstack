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
        <React.StrictMode>
      <BrowserRouter>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <CSSReset />
          <App />
      </BrowserRouter>
        </React.StrictMode>
    </ThemeProvider>
  </ChakraProvider>,
  document.getElementById("root")
)