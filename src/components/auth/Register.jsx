import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
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
      fetch("http://127.0.0.1:5000/api/v1/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pin: pin,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            alert("That username has already been taken!");
            throw new Error("Failed registration");
          }
        })
        .then((data) => {
          alert("Registration was successful");
          props.onLoginSuccess(data.user);
          navigate("/");
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form onSubmit={registerUser}>
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
        <Button type="submit">Register</Button>
      </Form>
    </>
  );
}
