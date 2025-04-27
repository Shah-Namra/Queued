import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Copy, 
  LogOut, 
  Share, 
  Check, 
  Moon, 
  Sun,
  Power,
  Users,
  ClipboardCopy
} from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoomNavbarProps {
  roomCode: string;
  isCreator: boolean;
  userCount: number;
  onLeaveRoom: () => void;
  onEndSession: () => void;
  onToggleSidebar: () => void;
}

export const RoomNavbar: React.FC<RoomNavbarProps> = ({ 
  roomCode, 
  isCreator, 
  userCount,
  onLeaveRoom, 
  onEndSession,
  onToggleSidebar
}) => {
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Room code copied to clipboard');
  };
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update the theme in localStorage or context
    toast.success(`Switched to ${darkMode ? 'light' : 'dark'} mode`);
  };
  
  // Generate initials for avatar
  const getInitials = () => {
    const name = 'Guest User'; // In a real app, this would be the user's name
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <TooltipProvider>
      <header className="bg-gray-900 border-b border-gray-800 py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Left side - Room code */}
          <div className="flex items-center">
            <div className={`flex items-center rounded-md bg-gray-800/50 px-3 py-1.5 ${isCreator ? 'text-purple-400' : 'text-gray-300'}`}>
              <span className="text-sm font-medium">
                Room: <span className="font-mono">{roomCode}</span>
                {isCreator && <span className="ml-2 bg-purple-600 text-xs px-2 py-0.5 rounded-full">Creator</span>}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={copyRoomCode}
                    className="h-8 w-8 ml-1 text-gray-300 hover:text-white hover:bg-gray-800"
                    aria-label="Copy room code"
                  >
                    {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Copy room code</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onToggleSidebar}
                  className="ml-2 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Users size={16} className="mr-1" />
                  <span className="text-xs">{userCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>View participants</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Right side - User controls */}
          <div className="flex items-center space-x-2">
            {/* Invite Users (Creator only) */}
            {isCreator && (
              <Sheet>
                <SheetTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                      >
                        <Share size={16} className="mr-1" />
                        Invite
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Share room with friends</p>
                    </TooltipContent>
                  </Tooltip>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-800 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white">Invite Friends</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Room Code</h4>
                      <div className="flex items-center">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 font-mono text-lg text-center">
                          {roomCode}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={copyRoomCode}
                          className="ml-2 h-10 w-10 text-gray-300 hover:text-white hover:bg-gray-800"
                          aria-label="Copy room code"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Share Link</h4>
                      <div className="flex items-center">
                        <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 truncate text-sm">
                          {`${window.location.origin}/room/${roomCode}`}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/room/${roomCode}`);
                            toast.success('Link copied to clipboard');
                          }}
                          className="ml-2 h-10 w-10 text-gray-300 hover:text-white hover:bg-gray-800"
                          aria-label="Copy link"
                        >
                          <Copy size={18} />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">QR Code</h4>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        {/* This would be a real QR code in production */}
                        <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-xs text-gray-400">
                          QR Code Placeholder
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {/* End Session (Creator only) */}
            {isCreator && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={onEndSession}
                    className="bg-red-700 hover:bg-red-800"
                  >
                    <Power size={16} className="mr-1" />
                    End Session
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>End session for all participants</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* User Avatar & Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-gray-700">
                  <AvatarFallback className="bg-purple-700 text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                  {darkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={onLeaveRoom} className="text-red-400 cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  <span>Leave Room</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
