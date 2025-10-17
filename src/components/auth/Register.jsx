import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const navigate = useNavigate();

  function registerUser(e) {
    e?.preventDefault();
    const passwordPolicyRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!username || !password) {
      toast.error("You must provide both a username and password!");
    } else if (password !== confirmedPassword) {
      toast.error("Your passwords do not match!");
    } else if (!passwordPolicyRegex.test(password)) {
      toast.error("Your password does not meet the policy requirements.");
    } else {
      fetch("/api/v1/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((data) => {
              toast.error(data.msg || "That username has already been taken!");
              throw new Error(data.msg || "Failed registration");
            });
          }
        })
        .then((data) => {
          toast.success("Registration was successful!");
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
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control
          id="passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Control>
        <Form.Text>
          Passwords must be at least 8 characters long and contain at least one
          uppercase letter, one lowercase letter, one number, and one special
          character.
        </Form.Text>
        <Form.Label htmlFor="confirmPasswordInput">Confirm Password</Form.Label>
        <Form.Control
          id="confirmPasswordInput"
          type="password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        ></Form.Control>
        <Button className="mt-2" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
}
