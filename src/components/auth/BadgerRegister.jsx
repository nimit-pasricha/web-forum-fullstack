import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
  const navigate = useNavigate();

  function registerUser(e) {
    e?.preventDefault();
    const regex = /^\d{7}$/;
    if (!regex.test(pin) || !regex.test(confirmedPin)) {
      alert("Your pin must be a 7-digit number!");
    } else if (!username || !pin) {
      alert("You must provide both a username and pin!");
    } else if (pin !== confirmedPin) {
      alert("Your pins do not match!");
    } else {
      fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": "TODO",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pin: pin,
        }),
      })
        .then((res) => {
          if (res.status === 409) {
            alert("That username has already been taken!");
          } else if (res.status === 200) {
            alert("Registration was successful");
            sessionStorage.setItem("loginStatus", JSON.stringify(username));
            setLoginStatus(username);
            navigate("/");
          } else {
            throw new Error("failed registration");
          }
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control
          id="usernameInput"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></Form.Control>

        <Form.Label htmlFor="pinInput">Pin</Form.Label>
        <Form.Control
          id="pinInput"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        ></Form.Control>

        <Form.Label htmlFor="confirmPinInput">Confirm Pin</Form.Label>
        <Form.Control
          id="confirmPinInput"
          type="password"
          value={confirmedPin}
          onChange={(e) => setConfirmedPin(e.target.value)}
        ></Form.Control>
        <Button type="submit" onClick={(e) => registerUser(e)}>
          Register
        </Button>
      </Form>
    </>
  );
}
