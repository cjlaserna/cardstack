import "./App.css";

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar/Navbar";
import { Login } from './components/Login'
import { AuthProvider } from "./backend/Auth";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { Cardset } from "./components/FlashcardComponents/Cardset";
import { Box } from "@chakra-ui/react";
import { CardsetFull } from "./components/FlashcardComponents/CardsetFull";

function App() {
  return (
    <>
    <AuthProvider>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cardset/:user/:setname" element={<Cardset/>} />
        <Route path="cardset/:user/:setname/full" element={<CardsetFull/>} />
      </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
