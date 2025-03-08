import React, { useEffect, useState } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";

export default function BadgerChatroom(props) {
  const [messages, setMessages] = useState([]);
  // TODO: Reset page to first page when user change rooms
  const [page, setPage] = useState(1);

  const loadMessages = () => {
    fetch(
      `https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`,
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setMessages(json.messages);
      });
  };

  // Why can't we just say []?
  // The BadgerChatroom doesn't unload/reload when switching
  // chatrooms, only its props change! Try it yourself.
  useEffect(loadMessages, [props, page]);

  return (
    <>
      <h1>{props.name} Chatroom</h1>
      {/* TODO: Allow an authenticated user to create a post. */}
      <hr />
      {messages.length > 0 ? (
        <>
          <Container fluid>
            <Row>
              {messages.map((message) => (
                <Col key={message.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                  <BadgerMessage {...message}></BadgerMessage>
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
