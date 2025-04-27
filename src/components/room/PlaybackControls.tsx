/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Users
} from 'lucide-react';
import Image from 'next/image';

interface CurrentSong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // in seconds
  progress: number; // in seconds
  suggestedBy: string;
}

interface PlaybackControlsProps {
  currentSong: CurrentSong;
  isCreator: boolean;
  userCount: number;
  onToggleUserList: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentSong,
  isCreator,
  userCount,
  onToggleUserList
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [skipVotes, setSkipVotes] = useState({ current: 1, required: Math.ceil(userCount / 2) });
  const [hasVotedToSkip, setHasVotedToSkip] = useState(false);
  
  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  // Handle skip vote
  const handleSkipVote = () => {
    if (!hasVotedToSkip) {
      setSkipVotes(prev => ({ ...prev, current: prev.current + 1 }));
      setHasVotedToSkip(true);
      
      // If enough votes, skip automatically
      if (skipVotes.current + 1 >= skipVotes.required) {
        // In a real app, this would trigger the actual skip
        console.log('Song skipped due to votes');
      }
    }
  };
  
  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 py-3 px-4">
      <div className="flex items-center justify-between">
        {/* Song info (mobile view) */}
        <div className="flex items-center md:w-1/4">
          <Image
            src={currentSong.albumArt} 
            alt={currentSong.title} 
            width={40}
            height={40}
            className="h-10 w-10 rounded mr-3 hidden sm:block" 
          />
          <div className="min-w-0 hidden sm:block">
            <h4 className="text-white font-medium text-sm truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
          </div>
        </div>
        
        {/* Playback controls */}
        <div className="flex items-center justify-center space-x-3 md:w-2/4">
          {/* Play/Pause */}
          <Button 
            variant="outline"
            size="icon"
            onClick={togglePlayback}
            className="h-10 w-10 rounded-full bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          {/* Skip button with vote counter */}
          <Button 
            variant="outline"
            size="sm"
            onClick={handleSkipVote}
            disabled={hasVotedToSkip}
            className={`bg-gray-800 border-gray-700 hover:bg-gray-700 ${hasVotedToSkip ? 'opacity-50' : ''}`}
          >
            <SkipForward size={16} className="mr-1" />
            <span>{skipVotes.current}/{skipVotes.required}</span>
          </Button>
          
          {/* User list toggle (mobile only) */}
          <Button 
            variant="outline"
            size="sm"
            onClick={onToggleUserList}
            className="md:hidden bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            <Users size={16} className="mr-1" />
            <span>{userCount}</span>
          </Button>
        </div>
        
        {/* Volume control (visible only to creator or on larger screens) */}
        <div className="items-center space-x-2 hidden md:flex md:w-1/4 justify-end">
          {/* Volume icon */}
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-gray-400 hover:text-white"
            disabled={!isCreator}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          {/* Volume slider */}
          <div className="w-24">
            <Slider
              disabled={!isCreator || isMuted}
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className={!isCreator ? 'opacity-50' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
