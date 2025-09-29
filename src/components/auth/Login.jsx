import React, { useContext, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

export default function Login() {
  const usernameRef = useRef();
  const pinRef = useRef();
  const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);
  const navigate = useNavigate();

  function login(e) {
    e?.preventDefault();
    const regex = /^\d{7}$/;
    if (!regex.test(pinRef.current.value)) {
      alert("Your pin is a 7-digit number!");
    } else if (!usernameRef.current.value || !pinRef.current.value) {
      alert("You must provide both a username and pin!");
    } else {
      fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": "TODO",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          pin: pinRef.current.value,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            alert("Incorrect username or pin!");
          } else if (res.statys === 400) {
            alert("A request must contain a 'username' and 'pin'")
          } else if (res.status === 200) {
            alert("Login was successful");
            sessionStorage.setItem("loginStatus", JSON.stringify(usernameRef.current.value));
            setLoginStatus(usernameRef.current.value);
            navigate("/");
          } else {
            throw new Error("failed login");
          }
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <>
      <h1>Login</h1>
      <Form>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control
          id="usernameInput"
          ref={usernameRef}
        ></Form.Control>

        <Form.Label htmlFor="pinInput">Pin</Form.Label>
        <Form.Control
          id="pinInput"
          type="password"
          ref={pinRef}
        ></Form.Control>
        <Button type="submit" onClick={(e) => login(e)}>
          Login
        </Button>
      </Form>
    </>
  );
}
