"use client";

import React from "react";
import { motion } from "framer-motion";
import { DoorOpen, Music2, ThumbsUp, Sparkles } from "lucide-react";

const Work = () => {
  const steps = [
    {
      icon: <DoorOpen className="w-8 h-8" />,
      title: "Join or Create a Room",
      description: "Start a new music room or join one with a code.",
      highlight: "Step 1",
    },
    {
      icon: <Music2 className="w-8 h-8" />,
      title: "Suggest Songs",
      description: "Search and add your favorite tracks to the queue.",
      highlight: "Step 2",
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: "Vote & Listen",
      description: "Upvote songs and enjoy the playlist together.",
      highlight: "Step 3",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10
             text-purple-300 mb-4"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">How It Works</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 
          bg-clip-text text-transparent">
            Start Listening Together
          </h2>
        </motion.div>

        {/* Steps Container */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                {...step}
                index={index + 1}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ 
  icon, 
  title, 
  description, 
  highlight,
  index,
  isLast 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  highlight: string;
  index: number;
  isLast: boolean;
}) => (
  <div className="relative group">
    {/* Connection Line */}
    {!isLast && (
      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent">
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-purple-500/50 transform 
          rotate-45 -translate-y-1/2"
        />
      </div>
    )}

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm
        hover:bg-gray-800/70 transition-all duration-300"
    >
      {/* Step Number */}
      <div className="absolute -top-3 -left-3">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-20" />
          <div className="relative w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{index}</span>
          </div>
        </div>
      </div>

      {/* Moving Border Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-border-flow" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-border-flow-vertical" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-border-flow" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-border-flow-vertical" />
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center
          ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
          {icon}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-purple-400/80">{highlight}</span>
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2">
          <div className="w-1 h-1 rounded-full bg-purple-400/30" />
          <div className="w-1 h-1 rounded-full bg-purple-400/20 mt-1" />
        </div>
      </div>
    </motion.div>
  </div>
);

export default Work;