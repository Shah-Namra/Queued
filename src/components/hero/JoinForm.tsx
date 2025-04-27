
"use client"; // Add this at the top if using Next.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const HeroJoinForm = () => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code to join");
      toast.error("Please enter a room code to join");
      return;
    }

    setError("");
    setIsJoining(true);

    setTimeout(() => {
      if (Math.random() > 0.8) {
        setIsJoining(false);
        setError("Room code not found. Please check and try again.");
        toast.error("Room code not found");
        return;
      }

      setIsJoining(false);
      setJoined(true);
      toast.success("You've successfully joined the room");

      setTimeout(() => {
        router.push(`/room/${roomCode}`);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="p-3 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700">
      <p className="text-xs text-gray-400 mb-2 flex items-center">
        <Link className="w-3 h-3 mr-1 text-purple-400" />
        Already have a room code? Join directly:
      </p>
      
      <div className="flex space-x-2">
        <Input
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter room code"
          className="bg-gray-700/50 border-gray-600 focus:border-purple-500 text-white"
          disabled={isJoining || joined}
        />
        <Button 
          onClick={handleJoinRoom}
          className="bg-purple-600 hover:bg-purple-500 whitespace-nowrap"
          disabled={isJoining || joined}
        >
          {isJoining ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : joined ? (
            <Check className="w-4 h-4" />
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-1" />
              Join
            </>
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-red-400 flex items-start"
          >
            <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {joined && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-green-400 mt-2 flex items-center"
          >
            <Check className="w-3 h-3 mr-1" />
            You&apos;ve joined the room! Start adding songs.
          </motion.p>
        )}

        {isJoining && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-blue-400 mt-2 flex items-center"
          >
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Joining room...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroJoinForm;
