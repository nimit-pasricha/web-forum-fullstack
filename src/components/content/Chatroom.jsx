import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import Message from "./Message.jsx";
import LoginStatusContext from "../contexts/LoginStatusContext.js";

export default function Chatroom(props) {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loginStatus, setLoginStatus] = useContext(LoginStatusContext);

  const loadMessages = () => {
    fetch(
      `https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`,
      {
        credentials: "include",
        headers: {
          "Authorization": "TODO",
        },
      }
    )
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          return res.json();
        } else {
          throw new Error("Failed to fetch messages");
        }
      })
      .then((json) => {
        setMessages(json.messages);
      })
      .catch((err) => console.error(err));
  };

  // Why can't we just say []?
  // The Chatroom doesn't unload/reload when switching
  // chatrooms, only its props change! Try it yourself.
  useEffect(loadMessages, [props, page]);

  const postTitleRef = useRef();
  const postContentRef = useRef();

  function createPost(e) {
    e?.preventDefault();
    if (!postTitleRef.current.value || !postContentRef.current.value) {
      alert("You must provide both a title and content!");
    } else {
      fetch(
        `https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": "TODO",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitleRef.current.value,
            content: postContentRef.current.value,
          }),
        }
      )
        .then((res) => {
          if (res.status === 200) {
            alert("Successfully posted!");
            loadMessages();
            postTitleRef.current.value = "";
            postContentRef.current.value = "";
          } else {
            throw new Error("Failed to create post");
          }
        })
        .catch((err) => console.error(err));
    }
  }

  function deletePost(messageToDeleteId) {
    fetch(
      `https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${messageToDeleteId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": "TODO",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          alert("Successfully deleted the post!");
          loadMessages();
        } else {
          throw new Error("Failed to delete post");
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <h1>{props.name} Chatroom</h1>
      {loginStatus ? (
        <Form>
          <Form.Label htmlFor="postTitleInput">Post Title</Form.Label>
          <Form.Control id="postTitleInput" ref={postTitleRef}></Form.Control>
          <Form.Label htmlFor="postContentInput">Post Content</Form.Label>
          <Form.Control
            rows={2}
            id="postContentInput"
            ref={postContentRef}
          ></Form.Control>
          <br />
          <Button type="submit" onClick={(e) => createPost(e)}>
            Create Post
          </Button>
        </Form>
      ) : (
        <p>You must be logged in to post!</p>
      )}

      <hr />
      {messages.length > 0 ? (
        <>
          <Container fluid>
            <Row>
              {messages.map((message) => (
                <Col key={message.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                  <Message
                    {...message}
                    deletePost={deletePost}
                  ></Message>
                </Col>
              ))}
            </Row>
          </Container>
        </>
      ) : (
        <>
          <p>There are no messages on this page yet!</p>
        </>
      )}
      <Pagination>
        <Pagination.Item
          onClick={() => {
            setPage(1);
          }}
          active={page === 1}
        >
          1
        </Pagination.Item>
        <Pagination.Item
          onClick={() => {
            setPage(2);
          }}
          active={page === 2}
        >
          2
        </Pagination.Item>
        <Pagination.Item
          onClick={() => {
            setPage(3);
          }}
          active={page === 3}
        >
          3
        </Pagination.Item>
        <Pagination.Item
          onClick={() => {
            setPage(4);
          }}
          active={page === 4}
        >
          4
        </Pagination.Item>
      </Pagination>
    </>
  );
}
