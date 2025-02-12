import { useRef, useEffect, useState } from "react";
import { characterPuzzles } from "../data/characterPuzzles";

export default function NumberLinkCanvas({ color, size, onSystemMessage }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [paths, setPaths] = useState({}); // 各キャラクターの経路を保存
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [gridSize, setGridSize] = useState(50); // グリッドのセルサイズ

  // パズルの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // ランダムなパズルを選択
    const randomPuzzle = characterPuzzles[Math.floor(Math.random() * characterPuzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    
    // キャンバスをクリア
    clearCanvas();
  }, []);

  // キャンバスのクリア
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (currentPuzzle) {
      drawGrid();
      drawCharacters();
      drawPaths();
    }
  };

  // グリッドの描画
  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    
    // 縦線
    for (let i = 0; i <= currentPuzzle.size; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, currentPuzzle.size * gridSize);
      ctx.stroke();
    }
    
    // 横線
    for (let i = 0; i <= currentPuzzle.size; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(currentPuzzle.size * gridSize, i * gridSize);
      ctx.stroke();
    }
  };

  // キャラクターの描画
  const drawCharacters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    currentPuzzle.characters.forEach(char => {
      char.positions.forEach(pos => {
        const [x, y] = pos;
        ctx.fillStyle = "black";
        ctx.fillText(
          char.emoji,
          x * gridSize + gridSize / 2,
          y * gridSize + gridSize / 2
        );
      });
    });
  };

  // パスの描画
  const drawPaths = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    Object.entries(paths).forEach(([char, path]) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.stroke();
    });
  };

  // マウスの位置からグリッドの座標を取得
  const getGridPosition = (x, y) => {
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    return [gridX, gridY];
  };

  // 指定された位置にキャラクターがあるかチェック
  const getCharacterAtPosition = (pos) => {
    if (!currentPuzzle) return null;
    
    for (const char of currentPuzzle.characters) {
      if (char.positions.some(([x, y]) => x === pos[0] && y === pos[1])) {
        return char.value;
      }
    }
    return null;
  };

  // 描画開始
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pos = getGridPosition(x, y);
    const character = getCharacterAtPosition(pos);
    
    if (character !== null) {
      setIsDrawing(true);
      setCurrentCharacter(character);
      // 新しい経路を開始
      setPaths(prev => ({
        ...prev,
        [character]: [[x, y]]
      }));
    }
  };

  // 描画中
  const draw = (e) => {
    if (!isDrawing || currentCharacter === null) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 現在の経路を更新
    setPaths(prev => {
      const currentPath = [...prev[currentCharacter]];
      currentPath.push([x, y]);
      return { ...prev, [currentCharacter]: currentPath };
    });
    
    clearCanvas();
  };

  // 描画終了
  const stopDrawing = () => {
    if (!isDrawing || currentCharacter === null) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const lastPath = paths[currentCharacter];
    const lastPoint = lastPath[lastPath.length - 1];
    const pos = getGridPosition(lastPoint[0], lastPoint[1]);
    
    // 終点が正しいキャラクターかチェック
    const character = getCharacterAtPosition(pos);
    if (character === currentCharacter) {
      if (onSystemMessage) {
        onSystemMessage(`やったね！${character}を繋げられたよ！次のキャラクターも繋げてみよう！`);
      }
    } else {
      // 不正解の場合は経路を削除
      setPaths(prev => {
        const newPaths = { ...prev };
        delete newPaths[currentCharacter];
        return newPaths;
      });
      clearCanvas();
    }
    
    setIsDrawing(false);
    setCurrentCharacter(null);
  };

  // やり直し
  const resetPaths = () => {
    setPaths({});
    setCurrentCharacter(null);
    setIsDrawing(false);
    clearCanvas();
  };

  // 新しいパズル
  const newPuzzle = () => {
    const randomPuzzle = characterPuzzles[Math.floor(Math.random() * characterPuzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    setPaths({});
    setCurrentCharacter(null);
    setIsDrawing(false);
    clearCanvas();
    
    if (onSystemMessage) {
      onSystemMessage("あたらしいパズルが始まりました！キャラクターを線で繋げてみよう！");
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid #ccc" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div>
        <button onClick={newPuzzle}>あたらしいパズル</button>
        <button onClick={resetPaths}>やりなおす</button>
      </div>
    </div>
  );
}
