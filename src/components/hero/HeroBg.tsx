import React from "react";
import { motion } from "framer-motion";
import { MusicWaves } from "../MusicWaves";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
      <div className="absolute inset-0 opacity-10">
        <MusicWaves />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-3xl"
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -120],
            x: Math.sin(i) * 20,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-[10%] text-purple-400/20"
          style={{ left: `${15 + i * 15}%` }}
        >
          ♪
        </motion.div>
      ))}
    </div>
  );
};

export default HeroBackground;
