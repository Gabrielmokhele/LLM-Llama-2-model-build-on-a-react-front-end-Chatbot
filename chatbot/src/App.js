import React, { useState } from "react";
import axios from "axios";
import { Plus, Search, HelpCircle, Mic, ArrowUp } from "lucide-react";
import { Button, IconButton, TextField } from "@mui/material";
import { Brush, Edit, Summarize, Code } from "@mui/icons-material";
import "./App.css";

const ChatInterface = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState("");

  const quickActions = [
    { icon: <Brush />, label: "Create image", color: "#e5e5e5" },
    { icon: <Edit />, label: "Help me write", color: "#e5e5e5" },
    { icon: <Summarize />, label: "Summarize text", color: "#e5e5e5" },
    { icon: <Code />, label: "Code", color: "#e5e5e5" },
  ];

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = { sender: "user", text: inputText };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await axios.post("http://127.0.0.1:8000/chat", {
          message: inputText,
        });

        const botMessage = {
          sender: "bot",
          text: response.data.response,
          image: response.data.image || null,
        };
        console.log("Received image data:", response.data.image);

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, something went wrong." },
        ]);
      }

      setVisible(true);
      setInputText("");
    }
  };

  return (
    <div className="chat-container">
      <div className="content-wrapper">
        <h1 className="title">What can I help with?</h1>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-button"
              style={{ borderColor: action.color, color: "#6B6B6B" }}
            >
              <span sx={{ fontSize: "10px" }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
        {visible && (
          <div
            className="chat-box"
            
            style={{
              height: "calc(100vh - 120px)",
              overflowY: "auto", 
              paddingBottom: "200px",
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
            }}
            
          >
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  elevation={3}
                  style={{ color: "#6B6B6B", padding: "15px" }}
                >
                  <div className={`message ${msg.sender}-message`}>
                    {msg.text}
                    {msg.image && (
                      
                      <img
                        src={`data:image/png;base64,${msg.image}`}
                        alt="Generated"
                        style={{ marginTop: "10px" }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
        <div
          className="chat-box"
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            maxWidth: "850px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <TextField
            multiline
            fullWidth
            minRows={4}
            placeholder="Message Llama 2"
            value={inputText}
            onChange={handleTextChange}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#e5e5e5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />
          <div className="chat-actions">
            <div sx={{ display: "flex" }}>
              <Button
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  marginRight: "2px",
                  height: "40px",
                  padding: 0,
                  borderRadius: "50%",
                  border: "1px solid #E5E5E5",
                  color: "#6B6B6B",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #E5E5E5",
                  },
                }}
              >
                <Plus size={20} />
              </Button>
              <Button
                sx={{
                  color: "#6B6B6B",
                  marginRight: "2px",
                  borderRadius: "25%",
                  "&:hover": { backgroundColor: "#F5F5F5", border: "none" },
                }}
                startIcon={<Search size={18} />}
              >
                Search
              </Button>
              <Button
                sx={{
                  color: "#6B6B6B",
                  borderRadius: "25%",
                  "&:hover": { backgroundColor: "#F5F5F5", border: "none" },
                }}
                startIcon={<HelpCircle size={18} />}
              >
                Reason
              </Button>
            </div>
            <div sx={{ display: " flex", alignItems: "center" }}>
              {inputText.trim() === "" ? (
                <IconButton
                  color="primary"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  <Mic size={20} />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "unset",
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                    borderRadius: "8px",
                  }}
                  onClick={sendMessage}
                >
                  <ArrowUp />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
