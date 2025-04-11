import React, { useState, useRef, useEffect } from "react";
import AiChat from "./AiChat";

const DraggableFloatingButton = ({ icon = "+", onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const padding = 30;
      const buttonHeight = buttonRef.current?.offsetHeight || 56;
      setPosition({
        x: padding,
        y: window.innerHeight - buttonHeight - padding,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const handleDrag = (x, y) => {
    const newX = x - (buttonRef.current?.offsetWidth || 56) / 2;
    const newY = y - (buttonRef.current?.offsetHeight || 56) / 2;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    handleDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = () => {
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleDrag(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  const getChatPosition = () => {
    const chatWidth = 270;
    const chatHeight = 300;
    const padding = 10;

    const isLeft = position.x < window.innerWidth / 2;
    const isTop = position.y < window.innerHeight / 2;

    const left = isLeft
      ? position.x + (buttonRef.current?.offsetWidth || 56) + padding
      : position.x - chatWidth - padding;

    const top = isTop
      ? position.y
      : position.y - chatHeight + (buttonRef.current?.offsetHeight || 56);

    return { left, top };
  };

  const chatPosition = getChatPosition();

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setAiChatOpen(!aiChatOpen)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="fixed bg-blue-600 hover:bg-blue-700 rounded-full p-4 shadow-lg cursor-grab active:cursor-grabbing z-50"
        style={{ left: position.x, top: position.y }}
      >
        {typeof icon === "string" ? (
          <img src={icon} alt="icon" className="w-6 h-6" />
        ) : (
          icon
        )}
      </button>

      {aiChatOpen && (
        <div
          className="fixed bg-white p-4 rounded-lg shadow-xl z-40 w-64 h-[300px] overflow-auto"
          style={{
            left: chatPosition.left,
            top: chatPosition.top,
          }}
        >
          <AiChat />
        </div>
      )}
    </>
  );
};

export default DraggableFloatingButton;
