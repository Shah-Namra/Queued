import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Clock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

// Mock data for search results
const mockSearchResults = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    albumArt: "https://via.placeholder.com/50",
    duration: "5:55",
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt: "https://via.placeholder.com/50",
    duration: "3:20",
  },
  {
    id: 3,
    title: "Dance Monkey",
    artist: "Tones and I",
    album: "The Kids Are Coming",
    albumArt: "https://via.placeholder.com/50",
    duration: "3:29",
  },
  {
    id: 4,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷",
    albumArt: "https://via.placeholder.com/50",
    duration: "3:53",
  },
  {
    id: 5,
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    albumArt: "https://via.placeholder.com/50",
    duration: "3:14",
  },
  {
    id: 6,
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    album: "Uptown Special",
    albumArt: "https://via.placeholder.com/50",
    duration: "4:30",
  },
];

interface SongSearchProps {
  isCreator: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SongSearch: React.FC<SongSearchProps> = ({ isCreator }) => {
  const [searchQuery, setSearchQuery] = useState("");
  interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    duration: string;
  }
  
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addedSongs, setAddedSongs] = useState<Record<number, number>>({});

  // Simulate search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Simulate random error (1 in 10 chance)
        if (Math.random() > 0.9) {
          throw new Error("Network error while searching");
        }

        const filteredResults = mockSearchResults.filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(filteredResults);

        // Show message if no results found
        if (filteredResults.length === 0) {
          setErrorMessage(`No songs found matching "${searchQuery}"`);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsError(true);
        setErrorMessage("An error occurred while searching. Please try again.");
        toast.error("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  // Handle adding a song to the queue
  const handleAddSong = (songId: number) => {
    // Store the timestamp when the song was added
    setAddedSongs((prev) => ({
      ...prev,
      [songId]: Date.now() + 5 * 60 * 1000,
    })); // 5 minute cooldown
    toast.success("Song added to queue");
  };

  // Check if a song is in cooldown
  const getSongCooldown = (songId: number) => {
    const cooldownEndTime = addedSongs[songId];
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
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Add Songs</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a song..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pr-12"
              disabled={isLoading}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 bg-gray-700 hover:bg-gray-600"
                  disabled={isLoading || !searchQuery.trim()}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Search for songs</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>

        {/* Error Message */}
        {errorMessage && !isLoading && (
          <div
            className={`mb-4 p-2 rounded ${
              isError
                ? "bg-red-900/20 border border-red-800/50"
                : "bg-gray-800/50 border border-gray-700"
            }`}
          >
            <div className="flex items-center">
              {isError ? (
                <AlertCircle
                  size={16}
                  className="text-red-400 mr-2 flex-shrink-0"
                />
              ) : (
                <Search
                  size={16}
                  className="text-gray-400 mr-2 flex-shrink-0"
                />
              )}
              <p
                className={`text-sm ${
                  isError ? "text-red-300" : "text-gray-300"
                }`}
              >
                {errorMessage}
              </p>
            </div>
            {errorMessage.includes("No songs found") && (
              <p className="text-gray-400 text-xs mt-1 ml-6">
                Try a different search term
              </p>
            )}
          </div>
        )}

        {/* Search Results */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center bg-gray-800/70 p-3 rounded-lg border border-gray-700"
                >
                  <Skeleton className="h-12 w-12 rounded bg-gray-700" />
                  <div className="flex-1 ml-3 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-gray-700" />
                    <Skeleton className="h-3 w-1/2 bg-gray-700" />
                  </div>
                  <Skeleton className="h-8 w-16 ml-2 bg-gray-700" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((song) => {
              const cooldownMs = getSongCooldown(song.id);
              const isInCooldown = cooldownMs > 0;

              return (
                <div
                  key={song.id}
                  className="flex items-center bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-colors"
                >
                  <Image
                    src={song.albumArt}
                    alt={song.album}
                    width={50}
                    height={50}
                    className="h-12 w-12 rounded mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {song.artist}
                    </p>
                    <p className="text-gray-500 text-xs">{song.album}</p>
                  </div>
                  <div className="ml-2 text-right flex flex-col items-end">
                    <span className="text-gray-400 text-xs mb-1">
                      {song.duration}
                    </span>
                    {isInCooldown ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
                            <Clock size={12} className="mr-1" />
                            <span>{formatCooldown(cooldownMs)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Cooldown - wait before adding another song</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleAddSong(song.id)}
                            className="bg-purple-700 hover:bg-purple-600 text-white h-8"
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Add song to queue</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            })
          ) : searchQuery && !errorMessage ? (
            <div className="text-center py-8 text-gray-400">
              <p>No songs found matching &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <p>Search for your favorite songs above</p>
              <p className="text-sm mt-1">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
