import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout.jsx";
import Login from "../auth/Login.jsx";
import Register from "../auth/Register.jsx";
import Logout from "../auth/Logout.jsx";
import Chatroom from "../content/Chatroom.jsx";
import BadgerChatHome from "../content/ChatHome.jsx";
import NoMatch from "../content/NoMatch.jsx";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

function App() {
  const [chatrooms, setChatrooms] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/v1/whoami", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setLoginStatus(data.user);
        }
      })
      .catch((err) => console.error("Could not verify user", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/v1/chatrooms")
      .then((res) => res.json())
      .then((json) => setChatrooms(json));
  }, []);

  const handleLoginSuccess = (user) => {
    setLoginStatus(user);
  };

  const handleLogoutSuccess = () => {
    setLoginStatus(null);
  };

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <LoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout chatrooms={chatrooms} />}>
            <Route index element={<BadgerChatHome />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/register"
              element={<Register onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/logout"
              element={<Logout onLogoutSuccess={handleLogoutSuccess} />}
            />
            {chatrooms.map((chatroom) => (
              <Route
                key={chatroom}
                path={`chatrooms/${chatroom}`}
                element={<Chatroom name={chatroom} />}
              />
            ))}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoginStatusContext.Provider>
  );
}

export default App;
