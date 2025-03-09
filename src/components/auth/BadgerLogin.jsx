import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import BadgerLoginStatusContext from "./../contexts/BadgerLoginStatusContext"

export default function BadgerLogin() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
  const navigate = useNavigate();

  function login() {
    const regex = /^\d{7}$/;
    if (!regex.test(pin)) {
      alert("Your pin is a 7-digit number!");
    } else if (!username || !pin) {
      alert("You must provide both a username and pin!");
    } else {
      fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pin: pin,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            alert("Incorrect username or pin!");
          } else if (res.status === 200) {
            alert("Login was successful");
            sessionStorage.setItem("loginStatus", JSON.stringify(true));
            setLoginStatus(true);
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
        <Form.Label>Username</Form.Label>
        <Form.Control
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></Form.Control>

        <Form.Label>Pin</Form.Label>
        <Form.Control
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        ></Form.Control>
        <Button onClick={() => login()}>Login</Button>
      </Form>
    </>
  );
}
