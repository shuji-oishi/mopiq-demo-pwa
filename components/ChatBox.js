import { useState } from "react";

export default function ChatBox({ systemMessage }) {
  const [messages, setMessages] = useState([
    { text: "こんにちは！塗り絵を楽しんでいますか？", sender: "ai" },
  ]);

  const sendMessage = async () => {
    const input = document.getElementById("userInput");
    const message = input.value;
    if (!message) return;
    
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    input.value = "";

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
  };

  // システムメッセージが変更されたら表示
  if (systemMessage && messages[messages.length - 1]?.text !== systemMessage) {
    setMessages((prev) => [...prev, { text: systemMessage, sender: "ai" }]);
  }

  return (
    <section className="chat-section">
      <h2>もぴっく君</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "ai" ? "ai-message" : "user-message"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input type="text" id="userInput" placeholder="メッセージを入力..." />
        <div className="button-group">
          <button 
            onClick={sendMessage}
            className="send-button"
          >
            送信
          </button>
        </div>
      </div>
      <style jsx>{`
        .chat-input-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .button-group {
          display: flex;
          gap: 10px;
        }
        .send-button {
          background-color: #2563eb;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .send-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </section>
  );
}
