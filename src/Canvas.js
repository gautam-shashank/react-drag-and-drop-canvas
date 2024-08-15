import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import Card from './Card';
import './Canvas.css';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [connections, setConnections] = useState([]);
  const canvasRef = useRef(null);

  // Memoized drawConnections function
  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const colors = ['#000000', '#1E1E1E', '#2C3E50', '#34495E', '#4A4A4A', '#5D6D7E', '#6E2C91', '#7D3C98', '#8E44AD', '#9B59B6']; // Different dark colors
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  
    connections.forEach(({ source, target }, index) => {
      const sourceCard = cards.find(card => card.id === source);
      const targetCard = cards.find(card => card.id === target);
  
      if (sourceCard && targetCard) {
        const startX = sourceCard.x + sourceCard.width / 2;
        const startY = sourceCard.y + sourceCard.height / 2;
  
        // Calculate the angle of the line
        const angle = Math.atan2(
          targetCard.y + targetCard.height / 2 - startY,
          targetCard.x + targetCard.width / 2 - startX
        );
  
        // Calculate the end point on the edge of the target card
        const endX =
          targetCard.x + targetCard.width / 2 - (targetCard.width / 2) * Math.cos(angle);
        const endY =
          targetCard.y + targetCard.height / 2 - (targetCard.height / 2) * Math.sin(angle);
  
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = colors[index % colors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
  
        // Draw arrowhead at the edge of the target card
        const arrowLength = 20; // Increased length of the arrowhead
        const arrowWidth = 10;  // Increased width of the arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - Math.PI / 6),
          endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowWidth * Math.cos(angle),
          endY - arrowWidth * Math.sin(angle)
        );
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + Math.PI / 6),
          endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
      }
    });
  }, [connections, cards]);
  

  useEffect(() => {
    drawConnections();
  }, [drawConnections]);

  const addCard = () => {
    const newCard = {
      id: `card-${cards.length + 1}`,
      text: `Enter the text for card ${cards.length + 1}.`,
      x: 100 + cards.length * 30,
      y: 100 + cards.length * 30,
      width: 200,
      height: 100,
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id, data) => {
    setCards(cards.map(card => (card.id === id ? { ...card, ...data } : card)));
  };

  const deleteCard = id => {
    setCards(cards.filter(card => card.id !== id));
    setConnections(connections.filter(conn => conn.source !== id && conn.target !== id));
  };

  const connectCards = (sourceId, targetCardNumber) => {
    const targetId = `card-${targetCardNumber}`;
    if (sourceId !== targetId && targetCardNumber !== '') {
      const newConnection = { source: sourceId, target: targetId };
      setConnections([...connections, newConnection]);
    }
  };

  return (
    <div className="canvas-container">
      <button className="add-card-button" onClick={addCard}>
        Add Card
      </button>
      <canvas ref={canvasRef} className="canvas-overlay" width={2000} height={2000}></canvas>
      {cards.map((card, index) => (
        <Rnd
          key={card.id}
          size={{ width: card.width, height: card.height }}
          position={{ x: card.x, y: card.y }}
          onDragStop={(e, d) => {
            updateCard(card.id, { x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateCard(card.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            });
          }}
          className="card-container"
        >
          <Card card={card} updateCard={updateCard} deleteCard={deleteCard} connectCards={connectCards} />
        </Rnd>
      ))}
    </div>
  );
};

export default Canvas;
