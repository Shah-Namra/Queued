import React from "react";
import { motion } from "framer-motion";
import HeroSongCard from "./SongCard";

const HeroIllustration = () => {
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={floatingVariants}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700 w-full max-w-[420px]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="p-6 space-y-5">
          {[1, 2, 3].map((item) => (
            <HeroSongCard key={item} index={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HeroIllustration;
