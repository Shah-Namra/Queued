/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Music, Copy, Check, Loader2, User, Tag, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useRouter } from "next/navigation"; 

const formSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  userName: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
});

const CreateRoom = () => {
  const router = useRouter();  
  const [formData, setFormData] = useState({
    roomName: "",
    userName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a room",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.roomName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create room');
      }

      setRoomCode(data.code);
      setRoomCreated(true);

      localStorage.setItem(
        'queuedRoomData',
        JSON.stringify({
          roomName: formData.roomName,
          userName: formData.userName,
          email: formData.email,
          roomCode: data.code,
        })
      );

      toast({
        title: 'Room Created Successfully',
        description: `Your room "${formData.roomName}" is ready!`,
      });

      // Navigate to the room page
      router.push(`/room/${data.code}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create room',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            y: -300,
            x: Math.sin(i) * 100,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 3,
          }}
          className="absolute text-3xl text-purple-400/10 font-bold"
          style={{ left: `${10 + i * 10}%`, bottom: "-5%" }}
        >
          {i % 2 === 0 ? "♪" : "♫"}
        </motion.div>
      ))}

      <div className="container mx-auto px-6 py-20 max-w-lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
              Create Your Music Room
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Set up a collaborative playlist space where friends can suggest
              and vote on tracks.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl"
          >
            {!roomCreated ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="roomName"
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4 text-purple-400" />
                      Room Name
                    </Label>
                    <Input
                      id="roomName"
                      name="roomName"
                      placeholder="My Awesome Playlist"
                      value={formData.roomName}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 focus:border-purple-500 text-white"
                      aria-describedby="roomName-error"
                    />
                    {errors.roomName && (
                      <p
                        id="roomName-error"
                        className="text-sm text-red-400 mt-1"
                      >
                        {errors.roomName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="userName"
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      Your Name (optional)
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      placeholder="DJ Awesome"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 focus:border-purple-500 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-purple-400" />
                      Email (optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 focus:border-purple-500 text-white"
                      aria-describedby="email-error"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Room...
                    </>
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex p-3 rounded-full bg-green-500/20 border border-green-500/30">
                  <Check className="w-6 h-6 text-green-400" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Room Created!
                  </h2>
                  <p className="text-gray-400">
                    Share this code with friends to invite them
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center border border-gray-600">
                  <span className="text-xl font-mono text-purple-300 tracking-wider">
                    {roomCode}
                  </span>
                  <Button
                    onClick={copyCodeToClipboard}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  onClick={() => router.push(`/room/${roomCode}`)}
                  className="w-full bg-purple-600 hover:bg-purple-500"
                >
                  Enter Room Now
                </Button>

                <Button
                  onClick={() => setRoomCreated(false)}
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  Create Another Room
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoom;
