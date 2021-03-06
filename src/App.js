import "./App.css";

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar/Navbar";
import { Login } from './components/Login'
import { AuthProvider } from "./backend/Auth";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { Cardset } from "./components/FlashcardComponents/Cardset";
import { CardsetFull } from "./components/FlashcardComponents/CardsetFull";
import { Username } from "./components/Username";

function App() {
  return (
    <>
    <AuthProvider>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="username" element={<Username/>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cardset/:user/:setname" element={<Cardset/>} />
        <Route path="cardset/:user/:setname/full" element={<CardsetFull/>} />
      </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
