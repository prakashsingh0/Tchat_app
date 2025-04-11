import React, { useState, useRef, useEffect } from "react";
import ChatContainer from "./ChatContainer";
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

  const handleDrag = (e) => {
    const newX = e.clientX - buttonRef.current.offsetWidth / 2;
    const newY = e.clientY - buttonRef.current.offsetHeight / 2;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = () => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Determine chat position based on screen regions
  const getChatPosition = () => {
    const chatWidth = 270; // approx width of chat box
    const chatHeight = 300; // approx height of chat box
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
