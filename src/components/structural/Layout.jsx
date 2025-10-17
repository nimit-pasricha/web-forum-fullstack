import { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from "../../assets/uw-crest.svg";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

function Layout(props) {
  const [loginStatus] = useContext(LoginStatusContext);
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
          {loginStatus && (
            <Navbar.Text>Welcome, {loginStatus.username}!</Navbar.Text>
          )}
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
