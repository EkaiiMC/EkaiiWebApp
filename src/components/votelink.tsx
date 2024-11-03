"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VoteSite } from "@prisma/client";

interface VotingData {
  hasVoted: boolean;
  nextVote?: Date;
  lastVote?: Date;
}

export default function VotingButton({ site }: { site: VoteSite }) {
  const [votingData, setVotingData] = useState<VotingData | null>(null);
  const [hover, setHover] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVotingData = async () => {
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 5000) {
        return;
      }
      lastFetchTimeRef.current = now;

      try {
        const response = await fetch(`/api/vote/${site.title}`);
        if (response.status === 429) {
          setVotingData({ hasVoted: false });
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch voting data');
        }
        const data = await response.json();
        if (data.nextVote) data.nextVote = new Date(data.nextVote);
        if (data.lastVote) data.lastVote = new Date(data.lastVote);
        setVotingData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVotingData();

    if (!votingData?.hasVoted) {
      intervalRef.current = setInterval(fetchVotingData, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [site.title, votingData?.hasVoted]);

  useEffect(() => {
    if (hover) {
      hoverIntervalRef.current = setInterval(() => {
        setVotingData((prevData) => {
          if (prevData?.nextVote) {
            return { ...prevData };
          }
          return prevData;
        });
      }, 1000);
    } else {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    }

    return () => {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    };
  }, [hover]);

  const getRemainingTime = () => {
    if (votingData?.nextVote) {
      const now = new Date();
      const remainingTime = votingData.nextVote.getTime() - now.getTime();
      const hours = Math.floor(remainingTime / 3600000);
      const minutes = String(Math.floor((remainingTime % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0');
      return hours > 0 ? `- ${hours}h${minutes}m${seconds}s` : `- ${minutes}m${seconds}s`;
    }
    return '';
  };

  return (
    <div className="flex justify-center items-center">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`px-2 py-2 text-white transition duration-300 text-lg w-48 text-center border-[3px] ${
          votingData?.hasVoted
            ? 'bg-bgDarkGray border-bgLightGray hover:border-topBorder'
            : 'bg-pinkText border-basePink hover:border-darkPink'
        }`}
      >
        {hover && votingData?.hasVoted ? getRemainingTime() : site.title}
      </a>
    </div>
  );
}