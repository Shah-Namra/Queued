import React from "react";
import { motion } from "framer-motion";

interface HeroFeatureCardProps { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}

const HeroFeatureCard = ({ 
  icon, 
  title, 
  description,
  gradient 
}: HeroFeatureCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`flex flex-col items-center text-center p-3 rounded-xl 
      bg-gradient-to-br ${gradient} backdrop-blur-sm border border-purple-500/10
      hover:border-purple-500/20 transition-all duration-300 shadow-sm hover:shadow-md`}
  >
    <motion.div 
      className="p-1.5 rounded-full bg-gray-900/50 mb-2 ring-2 ring-purple-500/10"
      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.div>
    <h3 className="font-semibold text-gray-200 text-xs mb-0.5">{title}</h3>
    <p className="text-xs text-gray-400">{description}</p>
  </motion.div>
);

export default HeroFeatureCard;
