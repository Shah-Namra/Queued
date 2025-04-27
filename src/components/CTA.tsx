"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music, Headphones, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient and decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-purple-900/30">
        {/* Decorative circles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Decorative music elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Musical notes animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 300, opacity: 0, scale: 0.5 }}
            animate={{
              y: -300,
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5],
              x: Math.sin(i * 30) * 100,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className="absolute text-4xl text-purple-400/10"
            style={{ left: `${10 + i * 10}%`, bottom: "0%" }}
          >
            {i % 2 === 0 ? "♪" : "♫"}
          </motion.div>
        ))}

        {/* Sound wave lines */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 10 }}
              animate={{
                height: [10, 20 + Math.random() * 30, 10],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 w-1 bg-purple-400 rounded-t-full"
              style={{
                left: `${5 + i * 10}%`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-8"
          >
            {/* Icon */}
            <motion.div
              className="inline-flex"
              whileHover={{ rotate: [0, -5, 5, -5, 5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-3 rounded-full bg-purple-500/30 border border-purple-500/40">
                <Headphones className="w-7 h-7 text-purple-400" />
              </div>
            </motion.div>

            {/* Main title with gradient */}
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                  Ready to Start Your
                </span>{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                  Music Party?
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Create your collaborative playlist room in seconds and invite
                your friends to join the musical journey.
              </p>
            </div>

            {/* Feature indicators */}
            <div className="flex flex-wrap justify-center gap-6 my-8">
              <FeatureBadge
                icon={<Music className="w-4 h-4" />}
                text="Group Playlists"
              />
              <FeatureBadge
                icon={<Star className="w-4 h-4" />}
                text="Song Voting"
              />
              <FeatureBadge
                icon={<Headphones className="w-4 h-4" />}
                text="Live Listening"
              />
            </div>

            {/* CTA button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => router.push("/create-room")}
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-7 text-lg group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 mt-10 opacity-50">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-purple-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureBadge = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/80 border border-gray-700"
  >
    <div className="text-purple-400">{icon}</div>
    <span className="text-sm text-gray-300">{text}</span>
  </motion.div>
);

export default CTA;
