/**
 * Navbar Component
 * 
 * A responsive navigation bar that adapts to different screen sizes and states.
 * Handles room navigation, user menu, and mobile responsiveness.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Share,
  Info,
  Menu,
  X,
  Music,
  Home,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// Types and Interfaces
interface NavbarProps {
  isInRoom?: boolean;
  roomId?: string;
  roomName?: string;
  userAvatar?: string;
  userName?: string;
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

interface UserMenuProps {
  userName: string;
  userAvatar: string;
  isInRoom: boolean;
  onLeaveRoom: () => void;
}

interface MobileNavigationProps {
  isInRoom: boolean;
  roomName: string;
  handleInvite: () => void;
  handleLeaveRoom: () => void;
  handleCreateRoom: () => void;
  handleJoinRoom: () => void;
  userName: string;
  userAvatar: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItemVariants: any;
}

// Animation Variants
const navbarVariants = {
  initial: { y: -100 },
  animate: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

/**
 * NavButton Component
 * A reusable navigation button with hover and active states
 */
const NavButton = ({ icon, label, to, isActive = false }: NavButtonProps) => (
  <Link href={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-gray-800/80 text-gray-100"
            : "hover:bg-gray-800/50 text-gray-200"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  </Link>
);

/**
 * UserMenu Component
 * Displays user information and actions in a dropdown menu
 */
const UserMenu = ({
  userName,
  userAvatar,
  isInRoom,
  onLeaveRoom,
}: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 p-1.5 rounded-full focus:outline-none"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-purple-500/20">
              <AvatarImage src={userAvatar || ""} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                {userName.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-purple-500 blur-lg opacity-20" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200 w-48">
        <DropdownMenuLabel className="text-gray-400">
          {userName || "User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </DropdownMenuItem>
        {isInRoom && (
          <>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="hover:bg-gray-700 text-red-400 cursor-pointer flex items-center space-x-2"
              onClick={onLeaveRoom}
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Room</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="hover:bg-gray-700 text-red-400 cursor-pointer flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * MobileNavigation Component
 * Handles mobile-specific navigation and menu items
 */
const MobileNavigation = ({
  isInRoom,
  roomName,
  handleInvite,
  handleLeaveRoom,
  handleCreateRoom,
  handleJoinRoom,
  // userName,
  // userAvatar,
  menuItemVariants,
}: MobileNavigationProps) => {
  return (
    <motion.div
      className="space-y-4"
      variants={{
        open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
      }}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <div className="space-y-3">
        <motion.div variants={menuItemVariants}>
          <Link
            href="/"
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800/50"
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-gray-200">Home</span>
          </Link>
        </motion.div>

        {!isInRoom ? (
          <>
            <motion.div variants={menuItemVariants}>
              <Button
                variant="default"
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                onClick={handleCreateRoom}
              >
                <Music className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </motion.div>
            <motion.div variants={menuItemVariants}>
              <Button
                variant="outline"
                className="w-full justify-start border-purple-600 text-purple-400 hover:bg-purple-600/10"
                onClick={handleJoinRoom}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Room
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={menuItemVariants}>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-purple-400">
                      Current Room
                    </span>
                    <p className="text-gray-200 font-medium">{roomName}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleInvite}
                    className="hover:bg-gray-700"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div variants={menuItemVariants}>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:bg-gray-800/50"
                onClick={handleLeaveRoom}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Room
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Main Navbar Component
 * Handles the main navigation functionality and state management
 */
export const Navbar = ({
  isInRoom = false,
  roomId,
  roomName = "Party Mix",
  userAvatar = "",
  userName = "User",
}: NavbarProps) => {
  // State Management
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event Handlers
  const generateInviteLink = (roomId?: string) => {
    if (!roomId) return null;
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/room/${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    return inviteLink;
  };

  const handleCreateRoom = () => {
    router.push("/create-room");
  };

  const handleJoinRoom = () => {
    const joinForm = document.getElementById("join-room-form");
    if (joinForm) {
      joinForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInvite = () => {
    const link = generateInviteLink(roomId);
    if (link) {
      toast.success("Invite link copied to clipboard!");
    } else {
      toast.error("No room ID provided for invite link");
    }
  };

  const handleLeaveRoom = () => {
    router.push("/");
    toast.info("You left the room");
  };

  // Don't render until component is mounted
  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navbarVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              </motion.div>
              <motion.span
                className="font-bold text-xl bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Queued
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {!isInRoom ? (
                <div className="flex items-center space-x-4">
                  <NavButton
                    icon={<Home className="w-4 h-4" />}
                    label="Home"
                    to="/"
                    isActive={pathname === "/"}
                  />
                  <Button
                    onClick={handleCreateRoom}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Create Room
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleJoinRoom}
                    className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                        whileHover={{ backgroundColor: "#374151" }}
                      >
                        <span className="text-purple-400">Room:</span>
                        <span className="font-medium truncate max-w-[200px]">
                          {roomName}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                        <Info className="w-4 h-4 text-gray-400" />
                        <span>Room Info</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem
                        className="hover:bg-gray-700 text-red-400 cursor-pointer flex items-center space-x-2"
                        onClick={handleLeaveRoom}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Leave Room</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={handleInvite}
                        className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 rounded-lg px-3 py-2 text-sm text-white transition-colors"
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                        variants={menuItemVariants}
                      >
                        <Share className="w-4 h-4" />
                        <span>Invite</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200">
                      <p>Copy invite link</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <UserMenu
                userName={userName}
                userAvatar={userAvatar}
                isInRoom={isInRoom}
                onLeaveRoom={handleLeaveRoom}
              />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-200" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-200" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg"
            >
              <div className="px-4 py-6 space-y-4">
                <MobileNavigation
                  isInRoom={isInRoom}
                  roomName={roomName}
                  handleInvite={handleInvite}
                  handleLeaveRoom={handleLeaveRoom}
                  handleCreateRoom={handleCreateRoom}
                  handleJoinRoom={handleJoinRoom}
                  userName={userName}
                  userAvatar={userAvatar}
                  menuItemVariants={menuItemVariants}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16" />
    </TooltipProvider>
  );
};
