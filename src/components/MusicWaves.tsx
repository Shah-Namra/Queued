import React from "react";
import { AudioWaveform } from "lucide-react";

export const MusicWaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Music Notes - keeping minimal to avoid overuse */}
      <div className="absolute top-10 left-10 text-purple-400 opacity-10 animate-float text-4xl">♪</div>
      <div className="absolute top-20 right-20 text-purple-500 opacity-10 animate-float text-5xl" style={{ animationDelay: "1s" }}>♫</div>
      <div className="absolute bottom-10 left-1/4 text-purple-600 opacity-10 animate-float text-6xl" style={{ animationDelay: "2s" }}>♪</div>
      
      {/* Abstract Sound Waves - subtle gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-400/5 to-transparent"></div>
      
      {/* Wave patterns - horizontal lines with subtle animation */}
      <div className="absolute left-0 right-0 top-1/3 opacity-5">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
          <path
            d="M0,40 C150,80 300,0 450,40 C600,80 750,0 900,40 C1050,80 1200,0 1350,40 V120 H0 V40Z"
            fill="none"
            stroke="url(#gradientWave1)"
            strokeWidth="2"
          ></path>
          <defs>
            <linearGradient id="gradientWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9b87f5" />
              <stop offset="50%" stopColor="#6E59A5" />
              <stop offset="100%" stopColor="#9b87f5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute left-0 right-0 bottom-1/3 opacity-5">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
          <path
            d="M0,80 C150,40 300,120 450,80 C600,40 750,120 900,80 C1050,40 1200,120 1350,80 V120 H0 V80Z"
            fill="none"
            stroke="url(#gradientWave2)"
            strokeWidth="2"
          ></path>
          <defs>
            <linearGradient id="gradientWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E69AB" />
              <stop offset="50%" stopColor="#9b87f5" />
              <stop offset="100%" stopColor="#7E69AB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Audio waveform elements - subtle indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-5">
        <AudioWaveform className="w-40 h-12 text-purple-400" />
      </div>
      
      <div className="absolute top-20 left-20 opacity-5">
        <AudioWaveform className="w-20 h-8 text-purple-500" />
      </div>
      
      <div className="absolute top-40 right-20 opacity-5">
        <AudioWaveform className="w-20 h-8 text-purple-600" />
      </div>
    </div>
  );
};
