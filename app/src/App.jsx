import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { Button, Form, Input } from "antd";
import Chat from "./Components/Chat";
import { ScrollToBottom } from "react-scroll-to-bottom";

const socket = io("http://localhost:3001");

function App() {
  const [value, SetValue] = useState("");
  const [room, SetRoom] = useState("");

  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);

  const JoinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("Join", room);
      setOpen(true);
      console.log(room);
    }
  };

  return (
    <div className="container">
      {open ? (
        <Chat
          socket={socket}
          userName={userName}
          room={room}
          value={value}
          SetValue={SetValue}
          SetRoom={SetRoom}
          setUserName={setUserName}
        />
      ) : (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Room"
            name="Room"
            style={{ marginTop: "20px" }}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input value={room} onChange={(e) => SetRoom(e.target.value)} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button onClick={JoinRoom} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default App;
