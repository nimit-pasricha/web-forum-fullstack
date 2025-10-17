import { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Login(props) {
  const usernameRef = useRef();
  const pinRef = useRef(); // Renaming to passwordRef would be a good next step
  const navigate = useNavigate();

  function login(e) {
    e?.preventDefault();
    if (!usernameRef.current.value || !pinRef.current.value) {
      toast.error("You must provide both a username and password!");
    } else {
      fetch("/api/v1/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: pinRef.current.value, // Backend expects 'password'
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            toast.error("Incorrect username or password!");
            throw new Error("Failed login");
          }
        })
        .then((data) => {
          toast.success("Login was successful!");
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

        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control
          id="passwordInput"
          type="password"
          ref={pinRef}
        ></Form.Control>
        <Button className="mt-2" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
