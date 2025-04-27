// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Music, Users, Vote, Sparkles, Play, ThumbsUp } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const Hero = () => {
//   // Enhanced animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   const floatingVariants = {
//     initial: { y: 0 },
//     animate: {
//       y: [-10, 10, -10],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <div className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
//       {/* Enhanced Background with multiple layers */}
//       <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
//         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

//         {/* Animated background decorations */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 0.1, scale: 1 }}
//           transition={{ duration: 1 }}
//           className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl"
//         />
//         <motion.div
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 0.1, scale: 1 }}
//           transition={{ duration: 1, delay: 0.3 }}
//           className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-3xl"
//         />

//         {/* Floating music notes */}
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 100 }}
//             animate={{
//               opacity: [0, 1, 0],
//               y: [-20, -120],
//               x: Math.sin(i) * 20,
//             }}
//             transition={{
//               duration: 4,
//               repeat: Infinity,
//               delay: i * 2,
//               ease: "easeInOut",
//             }}
//             className="absolute bottom-0 left-[10%] text-purple-400/20"
//             style={{ left: `${15 + i * 15}%` }}
//           >
//             ♪
//           </motion.div>
//         ))}
//       </div>

//       <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
//         >
//           {/* Enhanced Left Column */}
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <motion.div
//                 variants={itemVariants}
//                 className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400"
//               >
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 <span className="text-sm">Welcome to Queued</span>
//               </motion.div>

//               <motion.h1
//                 variants={itemVariants}
//                 className="text-4xl md:text-6xl font-bold"
//               >
//                 <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
//                   Group Vibes,
//                 </span>
//                 <br />
//                 <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
//                   Your Playlist
//                 </span>
//               </motion.h1>

//               <motion.p
//                 variants={itemVariants}
//                 className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed"
//               >
//                 Suggest, vote, and listen together—perfect for road trips, parties, or hangouts.
//               </motion.p>
//             </div>

//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <Button
//                 size="lg"
//                 className="bg-purple-600 hover:bg-purple-500 text-white transition-all hover:scale-105 transform"
//               >
//                 <Play className="w-4 h-4 mr-2" />
//                 Create a Room
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-purple-600 text-purple-400 hover:bg-purple-600/10 transition-all hover:scale-105 transform"
//               >
//                 <Users className="w-4 h-4 mr-2" />
//                 Join with Code
//               </Button>
//             </motion.div>

//             {/* Enhanced Feature Cards */}
//             <motion.div
//               variants={itemVariants}
//               className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
//             >
//               <FeatureCard
//                 icon={<Music className="w-5 h-5 text-purple-400" />}
//                 title="Collaborative"
//                 description="Add your favorite tracks to the queue"
//                 gradient="from-purple-500/20 to-purple-600/20"
//               />
//               <FeatureCard
//                 icon={<ThumbsUp className="w-5 h-5 tex// components/HeroSection.jsx
// import React from 'react';

// const HeroSection = () => {
//   return (
//     <section className="min-h-[600px] bg-gradient-to-b from-[#1A1A1A] to-[#2D2D2D] flex items-center overflow-hidden relative">
//       {/* Decorative Elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Music Notes */}
//         <div className="w-4 h-4 rounded-full bg-white opacity-20 absolute top-20 left-1/4" />
//         <div className="w-5 h-5 rounded-full bg-white opacity-20 absolute bottom-1/3 right-1/4" />
//         {/* Waveform */}
//         <div className="absolute bottom-10 left-0 right-0 h-1 bg-white opacity-10 waveform" />
//         {/* Green Accent Dots */}
//         <div className="w-2 h-2 rounded-full bg-[#1DB954] opacity-80 absolute top-1/3 left-1/2" />
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid md:grid-cols-2 gap-8 items-center">
//           {/* Text Column */}
//           <div className="space-y-6 text-center md:text-left">
//             {/* Heading */}
//             <h1 className="text-3xl md:text-5xl font-bold text-white font-sans">
//               Group Vibes, Your Playlist
//             </h1>

//             {/* Subheading */}
//             <p className="text-base md:text-lg text-[#B3B3B3] font-sans max-w-md mx-auto md:mx-0">
//               Suggest, vote, and listen together—perfect for road trips, parties, or hangouts.
//             </p>

//             {/* CTAs */}
//             <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
//               <button className="bg-[#1DB954] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1ED760] transition-colors duration-200 transform hover:scale-105">
//                 Create a Room
//               </button>
//               <button className="border border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-[#333333] transition-colors duration-200 transform hover:scale-105">
//                 Join with Code
//               </button>
//             </div>
//           </div>

//           {/* Visual Column */}
//           <div className="mt-8 md:mt-0 flex justify-center">
//             {/* Placeholder for visual - you can replace with actual image/illustration */}
//             <div className="w-64 h-96 bg-[#2D2D2D] rounded-lg shadow-lg transform rotate-3 flex items-center justify-center">
//               <div className="text-center text-[#1DB954]">
//                 {/* Mock UI Placeholder */}
//                 <div className="w-48 h-4 bg-[#1DB954] rounded mb-4 opacity-50" />
//                 <div className="w-32 h-4 bg-white rounded mb-4 opacity-30" />
//                 <div className="w-40 h-4 bg-[#1DB954] rounded opacity-50" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Waveform Animation */}
//       <style jsx>{`
//         .waveform {
//           background: linear-gradient(to right, transparent, #1DB954, transparent);
//           animation: wave 4s infinite linear;
//         }
//         @keyframes wave {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSection;t-purple-400" />}
//                 title="Democratic"
//                 description="Vote on what plays next"
//                 gradient="from-purple-600/20 to-purple-700/20"
//               />
//               <FeatureCard
//                 icon={<Users className="w-5 h-5 text-purple-400" />}
//                 title="Social"
//                 description="Share the DJ role with friends"
//                 gradient="from-purple-700/20 to-purple-800/20"
//               />
//             </motion.div>
//           </div>

//           {/* Enhanced Right Column - Visual */}
//           <motion.div
//             variants={itemVariants}
//             className="relative hidden md:block"
//           >
//             <motion.div
//               variants={floatingVariants}
//               initial="initial"
//               animate="animate"
//               className="relative"
//             >
//               {/* Decorative elements */}
//               <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
//               <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />

//               {/* Enhanced App Preview/Mockup */}
//               <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
//                 <div className="p-4 border-b border-gray-700">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-3 h-3 rounded-full bg-red-500" />
//                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
//                     <div className="w-3 h-3 rounded-full bg-green-500" />
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {/* Queue Preview with enhanced styling */}
//                   {[1, 2, 3].map((item) => (
//                     <motion.div
//                       key={item}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: item * 0.2 }}
//                       className="flex items-center space-x-4 p-4 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition-colors border border-gray-600/50"
//                     >
//                       <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                         <Music className="w-6 h-6 text-purple-400" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="h-4 w-32 bg-gray-600 rounded animate-pulse" />
//                         <div className="h-3 w-24 bg-gray-600/50 rounded mt-2" />
//                       </div>
//                       <div className="flex space-x-2">
//                         <motion.div
//                           whileHover={{ scale: 1.1 }}
//                           className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-500/30 transition-colors"
//                         >
//                           <ThumbsUp className="w-4 h-4 text-purple-400" />
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// const FeatureCard = ({
//   icon,
//   title,
//   description,
//   gradient
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   gradient: string;
// }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className={`flex flex-col items-center text-center p-6 rounded-xl
//       bg-gradient-to-br ${gradient} backdrop-blur-sm border border-purple-500/10
//       hover:border-purple-500/20 transition-all duration-300`}
//   >
//     <div className="p-3 rounded-full bg-gray-900/50 mb-4 ring-2 ring-purple-500/10">
//       {icon}
//     </div>
//     <h3 className="font-semibold text-gray-200 mb-2">{title}</h3>
//     <p className="text-sm text-gray-400">{description}</p>
//   </motion.div>
// );

// export default Hero;
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music, Users, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 
import HeroBackground from "./hero/HeroBg";
import HeroFeatureCard from "./hero/FeatureCard";
import HeroJoinForm from "./hero/JoinForm";
import HeroIllustration from "./hero/Illustration";

const Hero = () => {
  const router = useRouter(); 

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <HeroBackground />
      <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
        >
          <div className="space-y-10">
            <motion.div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Welcome to Queued</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                Group Vibes,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                Your Playlist
              </span>
            </motion.h1>

            <motion.p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Suggest, vote, and listen together—perfect for road trips, parties, or hangouts.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white transition-all hover:scale-105 transform px-8 py-6 text-lg"
                onClick={() => router.push('/create-room')} 
              >
                <Play className="w-5 h-5 mr-3" />
                Create a Room
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600/10 transition-all hover:scale-105 transform px-8 py-6 text-lg"
              >
                <Users className="w-5 h-5 mr-3" />
                Join with Code
              </Button>
            </motion.div>

            <motion.div className="mt-8 max-w-md">
              <HeroJoinForm />
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
              <HeroFeatureCard
                icon={<Music className="w-5 h-5 text-purple-400" />}
                title="Collaborative"
                description="Add your favorite tracks"
                gradient="from-purple-500/20 to-purple-600/20"
              />
              <HeroFeatureCard
                icon={<Users className="w-5 h-5 text-purple-400" />}
                title="Democratic"
                description="Vote on what plays next"
                gradient="from-purple-600/20 to-purple-700/20"
              />
              <HeroFeatureCard
                icon={<Music className="w-5 h-5 text-purple-400" />}
                title="Social"
                description="Share with friends"
                gradient="from-purple-700/20 to-purple-800/20"
              />
            </motion.div>
          </div>

          <motion.div className="relative hidden lg:block max-w-md mx-auto">
            <HeroIllustration />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

