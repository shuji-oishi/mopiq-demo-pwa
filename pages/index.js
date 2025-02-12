import { useState, useEffect } from "react";
import ColoringCanvas from "../components/ColoringCanvas";
import NumberLinkCanvas from "../components/NumberLinkCanvas";
import ChatBox from "../components/ChatBox";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [systemMessage, setSystemMessage] = useState("");
  const [mode, setMode] = useState("coloring");

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>mopiQ</h1>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.canvasArea}>
          <h2 className={styles.sectionTitle}>コンテンツエリア</h2>
          <div className={styles.controls}>
            <div className={styles.tools}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <input
                type="range"
                min="1"
                max="50"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
              />
            </div>

            <div className={styles.modeButtons}>
              <button 
                onClick={() => setMode('coloring')}
                className={`${styles.modeButton} ${mode === 'coloring' ? styles.activeMode : ''}`}
              >
                ぬりえモード
              </button>
              <button 
                onClick={() => setMode('numberlink')}
                className={`${styles.modeButton} ${mode === 'numberlink' ? styles.activeMode : ''}`}
              >
                ナンバーリンクモード
              </button>
            </div>

            {mode === 'coloring' ? (
              <ColoringCanvas
                color={color}
                size={size}
                onSystemMessage={setSystemMessage}
              />
            ) : (
              <NumberLinkCanvas
                color={color}
                size={size}
                onSystemMessage={setSystemMessage}
              />
            )}
          </div>
        </div>

        <div className={styles.chatArea}>
          <h2 className={styles.sectionTitle}>チャットエリア</h2>
          <ChatBox systemMessage={systemMessage} />
        </div>
      </div>
    </div>
  );
}
