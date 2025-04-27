import React from "react";
import { motion } from "framer-motion";
import { Music, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeroSongCardProps {
  index: number;
}

const HeroSongCard = ({ index }: HeroSongCardProps) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className="flex items-center space-x-3 p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition-colors border border-gray-600/50"
    >
      <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
        <Music className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1">
        <div className="h-3 w-24 bg-gray-600 rounded animate-pulse" />
        <div className="h-2 w-16 bg-gray-600/50 rounded mt-1.5" />
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-500/30 transition-colors"
            >
              <ThumbsUp className="w-3 h-3 text-purple-400" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
            <p className="text-xs">Vote to prioritize this song</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default HeroSongCard;