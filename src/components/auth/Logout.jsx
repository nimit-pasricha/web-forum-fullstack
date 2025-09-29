import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

export default function Logout() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);

  useEffect(() => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: {
        "Authorization": "TODO",
      },
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
