import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

export default function Logout() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/v1/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("failed to log out");
        }
      })
      .then((json) => {
        alert("You have been logged out");
        sessionStorage.setItem("loginStatus", null);
        setLoginStatus(null);
        navigate("/");
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h1>Logout</h1>
      <p>You have been successfully logged out.</p>
    </>
  );
}
