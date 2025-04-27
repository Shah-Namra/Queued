"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music, Sparkles, Headphones } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { CarouselMockups } from "./CarouselMockups";
import { MiniQueue } from "./MiniQueue";
import { MusicWaves } from "./MusicWaves";

const SneakPeek = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
        {/* Music wave background */}
        <div className="absolute inset-0 opacity-10">
          <MusicWaves />
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        
        {/* Music Notes Background */}
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
            className="absolute bottom-0 text-purple-400/20"
            style={{ left: `${15 + i * 15}%`, fontSize: "24px" }}
          >
            ♪
          </motion.div>
        ))}
        
        {/* Line pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent [mask-image:repeating-linear-gradient(to_right,transparent,transparent_2px,white_2px,white_4px)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-300 mb-4 relative"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Sneak Peek</span>
              {/* Decorative dots */}
              <div className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-purple-400/30" />
              <div className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-purple-400/30" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Experience the Magic
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Get a first look at how Queued transforms how you listen to music with friends
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side: Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-30" />
                <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-xl">
                  <CarouselMockups />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center ring-2 ring-purple-500/20"
                  >
                    <Music className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Interactive Elements */}
            <div className="space-y-8">
              {/* Before/After Slider */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-2xl blur-sm opacity-50" />
                <div className="relative bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
                      <Headphones className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Before & After</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-5">See how Queued transforms music listening from chaos to harmony</p>
                  <div className="h-64 md:h-80">
                    <BeforeAfterSlider />
                  </div>
                </div>
              </motion.div>

              {/* Mini Queue Demo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/20 to-purple-400/20 rounded-2xl blur-sm opacity-50" />
                <div className="relative bg-gray-800/60 p-6 rounded-2xl border border-purple-600/30 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
                      <Music className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Try It Out</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-5">Get a feel for how democratic voting works</p>
                  <MiniQueue />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  );
};

export default SneakPeek;
