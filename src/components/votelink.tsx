"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VoteSite } from "@prisma/client";

interface VotingData {
  hasVoted: boolean;
  nextVote?: Date;
  lastVote?: Date;
}

const INITIAL_FETCH_DELAY = 5000;
const POLLING_INTERVAL = 7000;
const MAX_POLLING_DURATION = 60000;

export default function VotingButton({ site }: { site: VoteSite }) {
  const [votingData, setVotingData] = useState<VotingData | null>(null);
  const [hover, setHover] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const clickTimeRef = useRef<number | null>(null);

  const fetchVotingData = async () => {
    const now = Date.now();
    if (now - lastFetchTimeRef.current < INITIAL_FETCH_DELAY) {
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

  useEffect(() => {
    fetchVotingData();
  }, [site.title, fetchVotingData]);

  useEffect(() => {
    if (clickTimeRef.current !== null) {
      const interval = setInterval(async () => {
        const now = Date.now();
        if (now - clickTimeRef.current! >= MAX_POLLING_DURATION || votingData?.hasVoted) {
          clearInterval(interval);
          return;
        }
        await fetchVotingData();
      }, POLLING_INTERVAL);

      intervalRef.current = interval; // Added to store the interval reference

      return () => clearInterval(interval);
    }
  }, [clickTimeRef.current, votingData?.hasVoted, fetchVotingData]);

  const handleClick = async () => {
    if (clickTimeRef.current === null) { // Added to debounce clicks
      clickTimeRef.current = Date.now();
      await fetchVotingData();
    }
  };

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
        onClick={handleClick}
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