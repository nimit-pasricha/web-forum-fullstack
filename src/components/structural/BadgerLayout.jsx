import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from "../../assets/uw-crest.svg";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {
  // TODO @ Step 6:
  // You'll probably want to see if there is an existing
  // user in sessionStorage first. If so, that should
  // be your initial loginStatus state.
  const [loginStatus, setLoginStatus] = useState(undefined);

  const [chatrooms, setChatrooms] = useState([]);
  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/chatrooms", {
      headers: {
        // eslint-disable-next-line no-undef
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          return res.json();
        } else {
          throw new Error("Failed to fetch chatrooms");
        }
      })
      .then((chatrooms) => {
        setChatrooms(chatrooms);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              alt="BadgerChat Logo"
              src={crest}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            BadgerChat
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="register">
              Register
            </Nav.Link>
            <NavDropdown title="Chatrooms">
              {chatrooms.map((chatroom) => (
                <NavDropdown.Item as={Link} to={`chatrooms/${chatroom}`} key={chatroom}>
                  {chatroom}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <BadgerLoginStatusContext.Provider
          value={[loginStatus, setLoginStatus]}
        >
          <Outlet />
        </BadgerLoginStatusContext.Provider>
      </div>
    </div>
  );
}

export default BadgerLayout;
