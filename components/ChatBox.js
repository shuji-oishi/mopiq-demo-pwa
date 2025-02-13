import { useState, useEffect } from "react";

export default function ChatBox({ systemMessage }) {
  const [messages, setMessages] = useState([
    { text: "こんにちは！塗り絵を楽しんでいますか？", sender: "ai", mode: "unknown" },
  ]);

  // システムメッセージが変更されたら自動的にAIに送信
  useEffect(() => {
    if (systemMessage) {
      handleSystemMessage(systemMessage);
    }
  }, [systemMessage]);

  const handleSystemMessage = async (message) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: `塗り絵が完了しました。以下の内容について分析してフィードバックしてください：\n${message}`,
        sessionId: 'default',
        isSystemMessage: true
      }),
    });
    const data = await response.json();
    if (data.reply) {
      setMessages((prev) => [...prev, { 
        text: data.reply, 
        sender: "ai",
        mode: data.mode 
      }]);
    }
  };

  const sendMessage = async () => {
    const input = document.getElementById("userInput");
    const message = input.value;
    if (!message) return;
    
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    input.value = "";

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message,
        sessionId: 'default'
      }),
    });
    const data = await response.json();
    if (data.reply) {
      setMessages((prev) => [...prev, { 
        text: data.reply, 
        sender: "ai",
        mode: data.mode 
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="chat-section" style={{ height: '50vh' }}>
      <h2>もぴっく君</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "ai" ? "ai-message" : "user-message"}`}>
            {msg.sender === "ai" && msg.mode && msg.mode !== "unknown" && (
              <div className="mode-badge">{msg.mode}</div>
            )}
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <textarea 
          id="userInput" 
          placeholder="メッセージを入力..."
          onKeyPress={handleKeyPress}
          rows={2}
        />
        <div className="button-group">
          <button 
            style={{ width: 'auto', whiteSpace: 'nowrap', minWidth: 'fit-content' }}
            onClick={sendMessage}
            className="send-button"
          >
            送信
          </button>
        </div>
      </div>
      <style jsx>{`
        .chat-section {
          display: flex;
          flex-direction: column;
          background-color: #f9fafb;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message {
          max-width: 80%;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
        }
        .message-text {
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.5;
        }
        .user-message {
          align-self: flex-end;
          background-color: #2563eb;
          color: white;
        }
        .ai-message {
          align-self: flex-start;
          background-color: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .chat-input-area {
          padding: 1rem;
          background-color: white;
          border-top: 1px solid #e5e7eb;
        }
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          resize: none;
          font-family: inherit;
          font-size: inherit;
          margin-bottom: 0.5rem;
        }
        textarea:focus {
          outline: none;
          border-color: #2563eb;
          ring: 2px solid #2563eb;
        }
        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .send-button {
          background-color: #2563eb;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .send-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }
        .mode-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          background-color: #4b5563;
          color: white;
          border-radius: 12px;
          margin-bottom: 4px;
          display: inline-block;
        }
      `}</style>
    </section>
  );
}
