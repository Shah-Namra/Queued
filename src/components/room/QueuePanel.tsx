import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Clock, Volume2, Trash2 } from "lucide-react";
import { MusicWaves } from "@/components/MusicWaves";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Mock data for queue
const initialQueue = [
  {
    id: "q1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumArt: "https://via.placeholder.com/50",
    suggestedBy: "Sam",
    upvotes: 3,
    downvotes: 1,
    duration: "3:53",
  },
  {
    id: "q2",
    title: "Bad Guy",
    artist: "Billie Eilish",
    albumArt: "https://via.placeholder.com/50",
    suggestedBy: "Jordan",
    upvotes: 2,
    downvotes: 0,
    duration: "3:14",
  },
  {
    id: "q3",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    albumArt: "https://via.placeholder.com/50",
    suggestedBy: "Taylor",
    upvotes: 1,
    downvotes: 2,
    duration: "4:30",
  },
  {
    id: "q4",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    albumArt: "https://via.placeholder.com/50",
    suggestedBy: "Alex",
    upvotes: 0,
    downvotes: 0,
    duration: "5:55",
  },
];

interface CurrentSong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // in seconds
  progress: number; // in seconds
  suggestedBy: string;
}

interface QueuePanelProps {
  currentSong: CurrentSong;
  isCreator: boolean;
  onRemoveSong?: (songId: string, songTitle: string) => void; // Added this prop
}

export const QueuePanel: React.FC<QueuePanelProps> = ({
  currentSong,
  isCreator,
  onRemoveSong,
}) => {
  const [queue, setQueue] = useState(initialQueue);
  const [voteCooldowns, setVoteCooldowns] = useState<
    Record<string, Record<string, number>>
  >({});
  const [progressValue, setProgressValue] = useState(
    Math.round((currentSong.progress / currentSong.duration) * 100)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        const newValue = prev + 0.5; // Increment by small amount for smooth progress
        return newValue >= 100 ? 100 : newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle voting
  const handleVote = (songId: string, isUpvote: boolean) => {
    // Check for cooldown
    const songCooldowns = voteCooldowns[songId] || {};
    const userId = "current-user"; // In a real app, this would be the actual user ID
    const cooldownEndTime = songCooldowns[userId];

    if (cooldownEndTime && cooldownEndTime > Date.now()) {
      // Still in cooldown, don't allow voting
      return;
    }

    // Update vote count
    setQueue((prev) =>
      prev.map((song) => {
        if (song.id === songId) {
          return {
            ...song,
            upvotes: isUpvote ? song.upvotes + 1 : song.upvotes,
            downvotes: !isUpvote ? song.downvotes + 1 : song.downvotes,
          };
        }
        return song;
      })
    );

    // Set cooldown (2 minutes)
    setVoteCooldowns((prev) => ({
      ...prev,
      [songId]: {
        ...songCooldowns,
        [userId]: Date.now() + 2 * 60 * 1000,
      },
    }));

    // Simulate loading state when resorting queue
    setIsLoading(true);

    // Resort the queue after voting (slight delay for visual feedback)
    setTimeout(() => {
      setQueue((prev) =>
        [...prev].sort((a, b) => {
          const netVotesA = a.upvotes - a.downvotes;
          const netVotesB = b.upvotes - b.downvotes;
          return netVotesB - netVotesA;
        })
      );
      setIsLoading(false);
    }, 500);
  };

  // Check if a song is in cooldown for the current user
  const getVoteCooldown = (songId: string) => {
    const songCooldowns = voteCooldowns[songId] || {};
    const userId = "current-user"; // In a real app, this would be the actual user ID
    const cooldownEndTime = songCooldowns[userId];

    if (!cooldownEndTime) return 0;

    const remainingMs = cooldownEndTime - Date.now();
    return Math.max(0, remainingMs);
  };

  // Format cooldown time
  const formatCooldown = (ms: number) => {
    if (ms <= 0) return "";
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Playing Now</h2>

      {/* Currently Playing Song */}
      <motion.div
        className="bg-gray-800/70 p-4 rounded-lg border border-purple-600/30 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-3">
          <Image
            src={currentSong.albumArt}
            alt={currentSong.title}
            width={56}
            height={56}
            className="h-14 w-14 rounded mr-4"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-lg">
              {currentSong.title}
            </h3>
            <p className="text-gray-400">{currentSong.artist}</p>
            <p className="text-gray-500 text-sm">
              Suggested by {currentSong.suggestedBy}
            </p>
          </div>
          <div className="ml-2">
            <MusicWaves />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <Progress value={progressValue} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatDuration(currentSong.progress)}</span>
            <span>{formatDuration(currentSong.duration)}</span>
          </div>
        </div>
      </motion.div>

      {/* Queue */}
      <h3 className="text-lg font-medium mb-3">Up Next</h3>
      <div className="overflow-y-auto flex-1 space-y-2 pr-1">
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700"
              >
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </>
        ) : queue.length > 0 ? (
          <AnimatePresence>
            {queue.map((song) => {
              const netVotes = song.upvotes - song.downvotes;
              const voteCooldownMs = getVoteCooldown(song.id);
              const isInCooldown = voteCooldownMs > 0;
              const isCurrentlyPlaying = song.id === currentSong.id;

              return (
                <motion.div
                  key={song.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center p-3 rounded-lg border hover:border-purple-500/30 transition-colors ${
                    isCurrentlyPlaying
                      ? "bg-gray-800/70 border-purple-500/50 shadow-md"
                      : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  {isCurrentlyPlaying && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-lg"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  <Image
                    width={50}
                    height={50}
                    src={song.albumArt}
                    alt={song.artist}
                    className="h-12 w-12 rounded mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h4 className="text-white font-medium truncate">
                        {song.title}
                      </h4>
                      {isCurrentlyPlaying && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-2 bg-purple-500/20 p-1 rounded-full">
                                <Volume2
                                  size={12}
                                  className="text-purple-400"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-gray-800 text-white border-gray-700"
                            >
                              <p className="text-xs">Currently playing</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {song.artist}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Added by {song.suggestedBy}
                    </p>
                  </div>
                  <div className="ml-2 flex flex-col items-end">
                    <span className="text-gray-400 text-xs mb-1">
                      {song.duration}
                    </span>
                    <div className="flex items-center">
                      {isInCooldown ? (
                        <div className="flex items-center text-gray-500 text-xs mr-2">
                          <Clock size={12} className="mr-1" />
                          <span>{formatCooldown(voteCooldownMs)}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center space-x-1">
                        {/* Add remove button for creator */}
                        {isCreator && onRemoveSong && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() =>
                                    onRemoveSong(song.id, song.title)
                                  }
                                  className="p-1.5 rounded-full text-red-500 hover:bg-red-500/20 transition-colors mr-1"
                                  aria-label="Remove song"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-gray-800 text-white border-gray-700"
                              >
                                <p className="text-xs">
                                  Remove song from queue
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleVote(song.id, true)}
                                disabled={isInCooldown}
                                className={`p-1.5 rounded-full ${
                                  isInCooldown
                                    ? "text-gray-600 cursor-not-allowed"
                                    : "text-green-500 hover:bg-green-500/20"
                                } transition-colors`}
                                aria-label="Upvote"
                              >
                                <ThumbsUp size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-gray-800 text-white border-gray-700"
                            >
                              <p className="text-xs">
                                Vote to move song up in queue
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <span
                          className={`text-sm font-medium px-1 ${
                            netVotes > 0
                              ? "text-green-500"
                              : netVotes < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {netVotes > 0 ? `+${netVotes}` : netVotes}
                        </span>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleVote(song.id, false)}
                                disabled={isInCooldown}
                                className={`p-1.5 rounded-full ${
                                  isInCooldown
                                    ? "text-gray-600 cursor-not-allowed"
                                    : "text-red-500 hover:bg-red-500/20"
                                } transition-colors`}
                                aria-label="Downvote"
                              >
                                <ThumbsDown size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-gray-800 text-white border-gray-700"
                            >
                              <p className="text-xs">
                                Vote to move song down in queue
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Queue is empty</p>
            <p className="text-sm mt-1">Add songs to get the party started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
