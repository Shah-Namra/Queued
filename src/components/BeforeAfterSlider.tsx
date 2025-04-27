/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import React, { useState, useRef } from "react";
import happyGroup from "../../public/Images/home/happy-group.svg";
import friendsArguing from "../../public/Images/home/friends-arguing.svg";


export const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = sliderRef.current!.getBoundingClientRect();
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const rect = sliderRef.current!.getBoundingClientRect();
      const touch = moveEvent.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-full overflow-hidden rounded-lg"
    >
      {/* Before Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src={friendsArguing}
          alt="Before using our app"
          width={600}
            height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4">
          <h4 className="text-white text-base font-semibold">Before</h4>
          <p className="text-purple-200 text-sm">Friends arguing over song choices</p>
        </div>
      </div>

      {/* After Image (shown based on slider position) */}
      <div 
        className="absolute inset-0 z-20"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <Image
          src={happyGroup}
          alt="After using our app"
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4">
          <h4 className="text-white text-base font-semibold">After</h4>
          <p className="text-purple-200 text-sm">Everyone enjoys a fair music experience</p>
        </div>
      </div>

      {/* Slider Control */}
      <div 
        className="absolute inset-0 z-30 cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Slider Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white z-30"
          style={{ left: `${sliderPosition}%` }}
        ></div>
        
        {/* Slider Handle */}
        <div 
          className="absolute w-8 h-8 rounded-full bg-purple-500 border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center"
          style={{ 
            left: `${sliderPosition}%`,
            top: '50%'
          }}
        >
          <div className="flex flex-col items-center">
            <span className="w-1 h-4 bg-white rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-gray-900/70 text-white px-2 py-1 rounded z-50 text-sm">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-gray-900/70 text-purple-400 px-2 py-1 rounded z-50 text-sm">
        After
      </div>
    </div>
  );
};
