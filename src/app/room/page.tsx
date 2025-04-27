"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoomNavbar } from '@/components/room/RoomNavbar';
import { SongSearch } from '@/components/room/SongSearch';
import { QueuePanel } from '@/components/room/QueuePanel';
import { PlaybackControls } from '@/components/room/PlaybackControls';
import { UserSidebar } from '@/components/room/UserSlider';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

// Mock data for the room
const mockRoomData = {
  id: 'X7K9P',
  name: 'Chill Night Mix',
  isCreator: true,
  currentSong: {
    id: 's1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://via.placeholder.com/60',
    duration: 219, // in seconds
    progress: 85, // in seconds
    suggestedBy: 'Alex',
  },
  users: [
    { id: 'u1', name: 'Alex', isCreator: true },
    { id: 'u2', name: 'Sam', isCreator: false },
    { id: 'u3', name: 'Jordan', isCreator: false },
    { id: 'u4', name: 'Taylor', isCreator: false },
  ],
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [room, setRoom] = useState(mockRoomData);
  const [showTutorial, setShowTutorial] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });
  
  // Simulate loading room data
  useEffect(() => {
    // In a real app, this would fetch room data from an API
    const hasSeenTutorial = localStorage.getItem('roomTutorialSeen');
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }

    toast.success('Connected to room successfully!');
  }, [roomId]);
  
  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('roomTutorialSeen', 'true');
  };
  
  const handleLeaveRoom = () => {
    setConfirmDialog({
      open: true,
      title: 'Leave Room',
      description: 'Are you sure you want to leave this room?',
      onConfirm: () => {
        navigate('/');
        toast.info('You left the room');
      },
    });
  };
  
  const handleEndSession = () => {
    setConfirmDialog({
      open: true,
      title: 'End Session',
      description: 'This will end the session for everyone. Are you sure?',
      onConfirm: () => {
        navigate('/');
        toast.info('Room session ended');
      },
    });
  };

  const handleKickUser = (userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      title: 'Kick User',
      description: `Are you sure you want to remove ${userName} from this room?`,
      onConfirm: () => {
        // In a real app, this would make an API call
        toast.success(`${userName} has been removed from the room`);
      },
    });
  };

  const handleRemoveSong = (songId: string, songTitle: string) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Song',
      description: `Are you sure you want to remove "${songTitle}" from the queue?`,
      onConfirm: () => {
        // In a real app, this would make an API call
        toast.success(`"${songTitle}" has been removed from the queue`);
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1F] text-white overflow-hidden">
      {/* Use the improved RoomNavbar */}
      <RoomNavbar 
        roomCode={roomId || room.id} 
        isCreator={room.isCreator} 
        onLeaveRoom={handleLeaveRoom}
        onEndSession={handleEndSession}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        userCount={room.users.length}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden mt-16">
        {/* Main content with search and queue */}
        <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Song Search */}
          <div className="w-full md:w-1/2 p-4 overflow-hidden flex flex-col">
            <SongSearch isCreator={room.isCreator} />
          </div>
          
          {/* Right Panel: Queue */}
          <div className="w-full md:w-1/2 p-4 overflow-hidden flex flex-col border-t md:border-t-0 md:border-l border-gray-800">
            <QueuePanel 
              currentSong={room.currentSong} 
              isCreator={room.isCreator} 
              onRemoveSong={handleRemoveSong}
            />
          </div>
        </main>
        
        {/* User Sidebar (visible when toggled) */}
        <UserSidebar 
          isOpen={showSidebar} 
          onClose={() => setShowSidebar(false)} 
          users={room.users}
          isCreator={room.isCreator}
          onKickUser={handleKickUser}
        />
      </div>
      
      {/* Playback Controls */}
      <PlaybackControls 
        currentSong={room.currentSong} 
        isCreator={room.isCreator}
        userCount={room.users.length}
        onToggleUserList={() => setShowSidebar(!showSidebar)}
      />
      
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 animate-float animate-pulse-glow">
            <h3 className="text-xl font-bold mb-3">Welcome to your Music Room!</h3>
            <div className="space-y-4 mb-6">
              <p>👉 <strong>Search</strong> for songs on the left panel</p>
              <p>👉 <strong>Vote</strong> on songs in the queue to move them up or down</p>
              <p>👉 <strong>Enjoy</strong> music together in real time!</p>
            </div>
            <button 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors font-medium"
              onClick={dismissTutorial}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.title.includes('Remove') || confirmDialog.title.includes('Kick') ? 'destructive' : 'default'}
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
              className={confirmDialog.title.includes('Remove') || confirmDialog.title.includes('Kick') ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;
