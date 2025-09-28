import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout.jsx';
import Login from '../auth/Login.jsx';
import Refactor from '../auth/Refactor.jsx';
import Logout from '../auth/Logout.jsx';
import Chatroom from '../content/Chatroom.jsx';
import BadgerChatHome from '../content/ChatHome.jsx';
import NoMatch from '../content/NoMatch.jsx';

function App() {

  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/chatrooms', {
        headers: {
        "Authorization": "TODO",
      }
    }).then(res => res.json()).then(json => {
      setChatrooms(json)
    })
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout chatrooms={chatrooms} />}>
          <Route index element={<BadgerChatHome />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Refactor />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          {
            chatrooms.map(chatroom => {
              return <Route key={chatroom} path={`chatrooms/${chatroom}`} element={<Chatroom name={chatroom} />} />
            })
          }
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
