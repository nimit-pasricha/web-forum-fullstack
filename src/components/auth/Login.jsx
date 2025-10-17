import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Login(props) {
  const usernameRef = useRef();
  const pinRef = useRef();
  const navigate = useNavigate();

  function login(e) {
    e?.preventDefault();
    const regex = /^\d{7}$/;
    if (!regex.test(pinRef.current.value)) {
      alert("Your pin is a 7-digit number!");
    } else if (!usernameRef.current.value || !pinRef.current.value) {
      alert("You must provide both a username and pin!");
    } else {
      fetch("/api/v1/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          pin: pinRef.current.value,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            alert("Incorrect username or pin!");
            throw new Error("Failed login");
          }
        })
        .then((data) => {
          alert("Login was successful");
          props.onLoginSuccess(data.user);
          navigate("/");
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <>
      <h1>Login</h1>
      <Form onSubmit={login}>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>

        <Form.Label htmlFor="pinInput">Pin</Form.Label>
        <Form.Control id="pinInput" type="password" ref={pinRef}></Form.Control>
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
}
