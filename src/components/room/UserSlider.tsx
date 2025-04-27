import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {  Crown, AlertCircle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  isCreator: boolean;
}

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  isCreator: boolean;
  onKickUser?: (userId: string, userName: string) => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
  users,
  isCreator,
  onKickUser,
}) => {
  // Mock recent activity
  const recentActivity = [
    { id: "a1", text: 'Sam added "Sweet Child O\' Mine"', time: "2 mins ago" },
    { id: "a2", text: "Queue reordered based on votes", time: "4 mins ago" },
    { id: "a3", text: 'Alex skipped "Billie Jean"', time: "5 mins ago" },
    { id: "a4", text: "Jordan joined the room", time: "7 mins ago" },
    { id: "a5", text: 'Taylor upvoted "Shape of You"', time: "8 mins ago" },
  ];

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Handle kicking a user
  const handleKickUser = (userId: string, userName: string) => {
    if (onKickUser) {
      onKickUser(userId, userName);
    }
  };

  return (
    <TooltipProvider>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="p-0 bg-gray-900 border-gray-800 w-80 sm:max-w-md"
        >
          <div className="flex flex-col h-full">
            {/* Users list */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white mb-4">
                People in this room ({users.length})
              </h2>

              <ScrollArea className="h-60">
                <div className="space-y-2 pr-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback
                            className={`text-xs ${
                              user.isCreator ? "bg-purple-700" : "bg-gray-700"
                            }`}
                          >
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          {user.isCreator && (
                            <div className="flex items-center text-purple-400 text-xs">
                              <Crown size={12} className="mr-1" />
                              <span>Room Creator</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Kick button (only shown to creator, and not for self) */}
                      {isCreator && !user.isCreator && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleKickUser(user.id, user.name)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              aria-label={`Kick ${user.name}`}
                            >
                              <UserX size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Remove from room</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Activity feed */}
            <div className="p-4 flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">
                Recent Activity
              </h2>

              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-2">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-gray-800/30 p-2 rounded border border-gray-800"
                    >
                      <p className="text-white text-sm">{activity.text}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Room Rules */}
            <div className="p-4 border-t border-gray-800">
              <div className="bg-gray-800/50 p-3 rounded-md">
                <div className="flex items-start mb-2">
                  <AlertCircle
                    size={16}
                    className="text-purple-400 mr-2 mt-0.5"
                  />
                  <h3 className="text-white font-medium text-sm">Room Rules</h3>
                </div>
                <ul className="text-gray-300 text-xs space-y-1 pl-6 list-disc">
                  <li>Be respectful of others&apos; music tastes</li>
                  <li>Wait 5 minutes between song suggestions</li>
                  <li>Vote responsibly to keep the best songs playing</li>
                </ul>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};
