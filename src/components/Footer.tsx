import React from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Music, 
  HeartPulse,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gray-900  pt-24 pb-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0"></div>
      
      {/* Animated music notes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0, 0.3, 0],
            y: -200,
            x: Math.sin(i * 40) * 100,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 text-3xl text-purple-400/10"
          style={{ left: `${20 + i * 15}%` }}
        >
          {i % 2 === 0 ? "♪" : "♫"}
        </motion.div>
      ))}
      
      {/* Decorative wave shape at bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      >
        <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M0,20 C300,80 600,0 900,40 C1100,65 1200,25 1200,25 L1200,60 L0,60 Z" 
            fill="url(#footer-gradient)" 
          />
          <defs>
            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      <div className="container mx-auto px-6  relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {/* Column 1 - Logo & Description */}
          <div className="space-y-8">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                Queued
              </h3>
            </motion.div>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              The collaborative music platform that brings people together through shared playlists and democratic song selection.
            </p>
            
            {/* Social icons with hover effects */}
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter className="w-5 h-5" />} />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} />
              <SocialIcon icon={<Github className="w-5 h-5" />} />
            </div>
          </div>
          
          {/* Column 2 - Newsletter with decorative elements */}
          <div className="space-y-8">
            <h4 className="text-xl font-medium text-white mb-2">Stay in the loop</h4>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Subscribe for updates and be the first to know when we launch.
            </p>
            
            {/* Email subscription with animated focus state */}
            <motion.div 
              className="flex max-w-md relative"
              whileHover={{ scale: 1.01 }}
            >
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 border border-gray-700 rounded-l-md py-3 px-4 text-base w-full focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <Button 
                className="bg-purple-600 hover:bg-purple-500 rounded-lg-none py-4"
              >
                Subscribe
              </Button>
              
              {/* Decorative glow effect */}
              <motion.div 
                className="absolute -inset-0.5 rounded-md bg-purple-500/20 opacity-0 blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
            </motion.div>
            
            {/* Animated feature tags */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["Early Access", "Product Updates", "Special Offers"].map((tag, index) => (
                <motion.span
                  key={tag}
                  className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-500">
          <p>© {currentYear} Queued. All rights reserved.</p>
          
          {/* Simple navigation links */}
          <div className="flex space-x-8 mt-6 md:mt-0">
            <motion.a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms
            </motion.a>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute bottom-60 left-20 opacity-5">
        <Music className="w-32 h-32 text-purple-400" />
      </div>
      <div className="absolute top-40 right-20 opacity-5">
        <HeartPulse className="w-40 h-40 text-purple-500" />
      </div>
      <div className="absolute bottom-20 right-1/3 opacity-5">
        <Headphones className="w-24 h-24 text-purple-300" />
      </div>
    </footer>
  );
};

// Helper components
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <motion.a 
    href="#" 
    whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.3)" }} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
  >
    {icon}
  </motion.a>
);

export default Footer;
