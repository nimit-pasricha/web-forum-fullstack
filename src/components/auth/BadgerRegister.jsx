import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function BadgerRegister() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");

  //   TODO: Handle other error codes

  function registerUser() {
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
          "X-CS571-ID": CS571.getBadgerId(),
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
            setUsername("");
            setPin("");
            setConfirmedPin("");
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

        <Form.Label>Confirm Pin</Form.Label>
        <Form.Control
          type="password"
          value={confirmedPin}
          onChange={(e) => setConfirmedPin(e.target.value)}
        ></Form.Control>
        <Button onClick={() => registerUser()}>Register</Button>
      </Form>
    </>
  );
}
