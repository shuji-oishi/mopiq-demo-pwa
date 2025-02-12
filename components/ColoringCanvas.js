import { useRef, useEffect, useState } from "react";
import { animalDrawings } from "../data/animalDrawings";

export default function ColoringCanvas({ color, size, onSystemMessage }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState(null);

  // 動物の線画を描画する関数
  const drawAnimal = (ctx, animal) => {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    animal.paths.forEach(path => {
      ctx.beginPath();
      const pathObj = new Path2D(path);
      ctx.stroke(pathObj);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // キャンバスをクリア
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ランダムな動物を選択
    const randomAnimal = animalDrawings[Math.floor(Math.random() * animalDrawings.length)];
    setCurrentAnimal(randomAnimal);

    // 動物の線画を描画
    drawAnimal(ctx, randomAnimal);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // キャンバスをクリア
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 現在の動物を再描画
    if (currentAnimal) {
      drawAnimal(ctx, currentAnimal);
    }

    // メッセージを送信
    if (onSystemMessage) {
      onSystemMessage("色や動物を変えて試してみよう！");
    }
  };

  const newAnimal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // キャンバスをクリア
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 新しいランダムな動物を選択
    const randomAnimal = animalDrawings[Math.floor(Math.random() * animalDrawings.length)];
    setCurrentAnimal(randomAnimal);

    // 動物の線画を描画
    drawAnimal(ctx, randomAnimal);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <div className="button-container">
        <button onClick={clearCanvas} className="control-button">クリア</button>
        <button onClick={newAnimal} className="control-button">次の動物</button>
        <button onClick={() => {
          if (onSystemMessage) {
            onSystemMessage("お疲れさまでした！");
          }
        }} className="complete-button">完了</button>
      </div>
      <style jsx>{`
        .canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
        }
        canvas {
          border: 2px solid #ccc;
          border-radius: 8px;
          background-color: white;
        }
        .button-container {
          display: flex;
          gap: 10px;
        }
        .control-button {
          background-color: #4b5563;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .control-button:hover {
          background-color: #374151;
        }
        .complete-button {
          background-color: #22c55e;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .complete-button:hover {
          background-color: #16a34a;
        }
      `}</style>
    </div>
  );
}
