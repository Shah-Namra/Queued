import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Music, Volume2, SkipForward } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

// Mock song data
const initialSongs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen", votes: 0, duration: "5:55" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", votes: 0, duration: "3:20" },
  { id: 3, title: "Dance Monkey", artist: "Tones and I", votes: 0, duration: "3:29" },
  { id: 4, title: "Shape of You", artist: "Ed Sheeran", votes: 0, duration: "3:53" },
];

export const MiniQueue = () => {
  const [songs, setSongs] = useState(initialSongs);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(initialSongs[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle upvote
  const handleUpvote = (id: number) => {
    setSongs(prevSongs => 
      prevSongs.map(song => 
        song.id === id ? { ...song, votes: song.votes + 1 } : song
      )
    );
    
    // Animated class for the button
    const button = document.getElementById(`upvote-${id}`);
    if (button) {
      button.classList.add('animate-bounce-slight');
      setTimeout(() => button.classList.remove('animate-bounce-slight'), 300);
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Sort songs after a slight delay
    setTimeout(() => {
      setSongs(prev => [...prev].sort((a, b) => b.votes - a.votes));
      setIsLoading(false);
    }, 400);
    
    toast({
      title: "Vote Recorded",
      description: "Your upvote has been added to the queue",
      duration: 2000,
    });
  };
  
  // Handle downvote
  const handleDownvote = (id: number) => {
    setSongs(prevSongs => 
      prevSongs.map(song => 
        song.id === id ? { ...song, votes: Math.max(song.votes - 1, -5) } : song
      )
    );
    
    // Animated class for the button
    const button = document.getElementById(`downvote-${id}`);
    if (button) {
      button.classList.add('animate-bounce-slight');
      setTimeout(() => button.classList.remove('animate-bounce-slight'), 300);
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Sort songs after a slight delay
    setTimeout(() => {
      setSongs(prev => [...prev].sort((a, b) => b.votes - a.votes));
      setIsLoading(false);
    }, 400);
    
    toast({
      title: "Vote Recorded",
      description: "Your downvote has been added to the queue",
      duration: 2000,
    });
  };
  
  // Play next song
  const playNextSong = () => {
    // Sort songs by votes
    const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes);
    
    // Filter out currently playing song
    const nextSongs = sortedSongs.filter(song => song.id !== currentlyPlaying.id);
    
    if (nextSongs.length > 0) {
      setCurrentlyPlaying(nextSongs[0]);
      toast({
        title: "Next Song",
        description: `Now playing: ${nextSongs[0].title} by ${nextSongs[0].artist}`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Currently Playing - with purple border */}
      <motion.div 
        className="bg-gray-800/70 p-3 rounded-lg border border-purple-600/30 flex items-center space-x-3"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-10 w-10 bg-purple-500/20 rounded-md flex items-center justify-center">
          <Volume2 className="h-6 w-6 text-purple-400" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium truncate">{currentlyPlaying.title}</p>
              <p className="text-gray-400 text-xs">{currentlyPlaying.artist}</p>
            </div>
            <span className="text-gray-500 text-xs">{currentlyPlaying.duration}</span>
          </div>
          {/* Progress bar - updated to purple */}
          <div className="w-full bg-gray-700/30 h-1 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="bg-purple-500 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "35%" }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={playNextSong}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors"
                aria-label="Skip to next song"
              >
                <SkipForward className="h-5 w-5 text-purple-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
              <p className="text-xs">Skip to next song</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
      
      {/* Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-white text-sm font-medium">Up Next</h4>
          <span className="text-xs text-gray-400">{songs.length - 1} songs</span>
        </div>
        
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {isLoading ? (
            // Loading state
            <>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-2 rounded-md border border-purple-500/30">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded mr-2" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                    <div className="flex space-x-1">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <AnimatePresence>
              {songs
                .filter(song => song.id !== currentlyPlaying.id)
                .sort((a, b) => b.votes - a.votes)
                .map(song => (
                  <motion.div 
                    key={song.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-800/40 p-2 rounded-md border border-purple-500/30 hover:border-purple-500/50 transition-colors flex items-center"
                  >
                    <div className="h-8 w-8 bg-purple-500/20 rounded flex items-center justify-center mr-2">
                      <Music className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-white text-sm font-medium truncate">{song.title}</p>
                      <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <span className={`text-sm font-medium px-2 rounded ${
                        song.votes > 0 ? 'text-purple-400' : 
                        song.votes < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {song.votes > 0 ? `+${song.votes}` : song.votes}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              id={`upvote-${song.id}`}
                              onClick={() => handleUpvote(song.id)}
                              className="p-1 rounded-full hover:bg-purple-500/20 transition-colors"
                              aria-label={`Upvote ${song.title}`}
                            >
                              <ThumbsUp className="h-4 w-4 text-purple-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                            <p className="text-xs">Vote song up</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              id={`downvote-${song.id}`}
                              onClick={() => handleDownvote(song.id)}
                              className="p-1 rounded-full hover:bg-red-400/20 transition-colors"
                              aria-label={`Downvote ${song.title}`}
                            >
                              <ThumbsDown className="h-4 w-4 text-red-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                            <p className="text-xs">Vote song down</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
