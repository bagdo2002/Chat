import React, { useEffect, useState, useRef } from "react";
import { ScrollToBottom } from "react-scroll-to-bottom";
import { RiMessengerLine } from "react-icons/ri";
import { Layout, Input, Button, List, Typography } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

const Chat = (props) => {
  const [elements, setElements] = useState([]);

  const ref = useRef(null);
  const refInput = useRef(null);
  const scrollToBottom = () => {
    const chatContainer = ref.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [elements]);

  useEffect(() => {
    const handleMessage = (data) => {
      setElements((prev) => [...prev, data]);
      console.log(data, "receive");
      props.SetValue("");
    };

    props.socket.on("recieve_message", handleMessage);

    return () => {
      props.socket.off("recieve_message", handleMessage);
    };
  }, [props.ssocket]);
  const sendMessage = async () => {
    if (props.value !== "") {
      const object = {
        message: props.value,
        room: props.room,
        user: props.userName,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await props.socket.emit("send_message", object);
      setElements((prev) => [...prev, object]);
      refInput.current.focus();
      props.SetValue("");
    }
  };

  return (
    <Layout
      style={{
        height: "400px",
        maxWidth: "300px",
        display: "flex",
        border: "1px solid rgb(22, 119, 255)",
      }}
    >
      <div
        style={{
          color: "031B29",
          background: "#f5f5f5",
          padding: "10px",
          fontSize: "1.3rem",
          display: "flex",
          alignItems: "center",
          fontWeight: "600",
          justifyContent: "space-between",
          borderBottom: "1px solid rgb(22, 119, 255)",
        }}
      >
        <div level={4}>{props.userName}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <RiMessengerLine style={{ fontSize: "1.8rem" }} />
        </div>
      </div>
      <Content
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          className="scrollable-container"
          style={{
            marginBottom: "16px",
            overflow: "scroll",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          ref={ref}
        >
          {elements.map((element, index) => (
            <div
              className="message"
              id={props.userName === element.user ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{element.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{element.time}</p>
                  <p id="author">{element.user}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", width: "100%" }}>
          <Input
            value={props.value}
            ref={refInput}
            onChange={(e) => props.SetValue(e.target.value)}
            placeholder="Type your message"
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <Button
            style={{ marginLeft: "5px" }}
            type="primary"
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Chat;
