import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import roomCreate from "../../public/Images/home/Room-creation.jpg";
import songQueue from "../../public/Images/home/song-queue.jpg";
import votingScreen from "../../public/Images/home/voting-screem.jpg";

// Mock data for carousel
const mockups = [
  {
    id: 1,
    title: "Room Creation",
    image: roomCreate,
    description: "Create custom rooms for different vibes and occasions",
  },
  {
    id: 2,
    title: "Song Queue",
    image: songQueue,
    description: "See what's playing next and add your tracks",
  },
  {
    id: 3,
    title: "Voting Screen",
    image: votingScreen,
    description: "Vote on songs to influence the playlist order",
  },
];

export const CarouselMockups = () => {
  const [current, setCurrent] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockups.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + mockups.length) % mockups.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % mockups.length);
  };

  return (
    <div className="relative w-full h-64 md:h-96">
      {/* Carousel content */}
      <div className="relative h-full overflow-hidden rounded-lg">
        {mockups.map((mockup, index) => (
          <div
            key={mockup.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === current
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={mockup.image}
              alt={mockup.title}
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-music-darker to-transparent p-4">
              <h4 className="text-music-light text-lg font-bold">
                {mockup.title}
              </h4>
              <p className="text-music-gray text-sm">{mockup.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-music-darker/80 text-music-light p-2 rounded-full hover:bg-music-purple/80 transition-colors"
        aria-label="Previous mockup"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-music-darker/80 text-music-light p-2 rounded-full hover:bg-music-purple/80 transition-colors"
        aria-label="Next mockup"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
        {mockups.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? "bg-music-green" : "bg-music-gray/50"
            }`}
            aria-label={`Go to mockup ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
