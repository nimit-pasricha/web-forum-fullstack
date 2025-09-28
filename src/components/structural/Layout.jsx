import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from "../../assets/uw-crest.svg";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

function Layout(props) {
  // TODO @ Step 6:
  // You'll probably want to see if there is an existing
  // user in sessionStorage first. If so, that should
  // be your initial loginStatus state.
  const [loginStatus, setLoginStatus] = useState(
    JSON.parse(sessionStorage.getItem("loginStatus"))
  );
  const chatrooms = props.chatrooms;
  
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
            {!loginStatus && (
              <Nav.Link as={Link} to="login">
                Login
              </Nav.Link>
            )}
            {!loginStatus && (
              <Nav.Link as={Link} to="register">
                Register
              </Nav.Link>
            )}
            {loginStatus && (
              <Nav.Link as={Link} to="logout">
                Logout
              </Nav.Link>
            )}
            <NavDropdown title="Chatrooms">
              {chatrooms.map((chatroom) => (
                <NavDropdown.Item
                  as={Link}
                  to={`chatrooms/${chatroom}`}
                  key={chatroom}
                >
                  {chatroom}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <LoginStatusContext.Provider
          value={[loginStatus, setLoginStatus]}
        >
          <Outlet />
        </LoginStatusContext.Provider>
      </div>
    </div>
  );
}

export default Layout;
