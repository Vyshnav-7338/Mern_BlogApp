import NavBar from "./Components/NavBar/NavBar";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Components/RegisterPage/Register";
import Login from "./Components/LogIn/Login";
import Home from "./Components/Home/Home";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Create from "./Components/Create/Create";
import Post from "./Components/Post/Post";
import PostEdit from "./Components/PostEdit/PostEdit";

export const userContext = createContext();
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((user) => {
        setUser(user.data);
      })
      .catch((err) => console.log(err));
  });

  return (
    <userContext.Provider value={user}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/postEdit/:id" element={<PostEdit />} />
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
