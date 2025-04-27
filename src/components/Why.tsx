"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Music2, Vote, Users2, Sparkles } from "lucide-react";

const Why = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0.3, 0.4], [50, 0]);

  return (
    <section className="relative py-20 overflow-hidden font-sans">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        {[...Array(5)].map((_, i) => (
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
            style={{ left: `${15 + i * 20}%`, fontSize: "24px" }}
          >
            ♪
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent [mask-image:repeating-linear-gradient(to_right,transparent,transparent_2px,white_2px,white_4px)]" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-300 mb-4 relative"
            >
              <div className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-purple-400/30" />
              <div className="absolute -left-1 w-1 h-1 rounded-full bg-purple-400/30" />
              <Sparkles className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Why Choose Us
              </span>
            </motion.div>
          </motion.div>

          {/* Main Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center ring-2 ring-purple-500/20 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Vote className="w-10 h-10 text-purple-400 relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10"
                />
              </motion.div>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight">
              Democratic Music Selection
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              The only platform where everyone has a voice in the playlist. Vote
              on songs, shape the queue, and enjoy music together.
            </p>
          </motion.div>

          {/* Supporting Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature
              icon={<Users2 className="w-5 h-5" />}
              title="Collaborative"
              description="Everyone contributes to a shared playlist experience."
            />
            <Feature
              icon={<Vote className="w-5 h-5" />}
              title="Democratic"
              description="A fair voting system values every preference."
            />
            <Feature
              icon={<Music2 className="w-5 h-5" />}
              title="Real-time"
              description="Instant updates reflect votes and suggestions."
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative p-5 rounded-lg bg-gray-800/40 border border-gray-700/40 hover:bg-gray-800/60 transition-colors duration-200 group"
  >
    {/* Subtle Decorative Details */}
    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-400/20 group-hover:bg-purple-400/40 transition-colors" />
    <div className="absolute bottom-2 left-2 w-2 h-px bg-gradient-to-r from-purple-500/0 to-purple-500/20" />

    <div className="space-y-3">
      <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/30 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-medium text-white tracking-tight group-hover:text-purple-100 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default Why;
