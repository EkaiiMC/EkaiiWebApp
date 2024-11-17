"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VoteSite } from "@prisma/client";

interface VotingData {
  hasVoted: boolean;
  nextVote?: Date;
  lastVote?: Date;
}

const POLLING_INTERVAL = 10000;
const MIN_API_CALL_INTERVAL = 5000; // 5 seconds

export default function VotingButton({ site, size }: { site: VoteSite, size: number }) {
  const [votingData, setVotingData] = useState<VotingData | null>(null);
  const [hover, setHover] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastApiCallRef = useRef<number>(0);
  const sizeTag = 'w-[' + size + 'px]';

  const fetchVotingData = async () => {
    const now = Date.now();
    if (now - lastApiCallRef.current < MIN_API_CALL_INTERVAL) {
      return;
    }
    lastApiCallRef.current = now;

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
  }, [site.title]);

  useEffect(() => {
    if (votingData?.hasVoted === false) {
      const interval = setInterval(fetchVotingData, POLLING_INTERVAL);
      intervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [votingData?.hasVoted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (votingData?.nextVote) {
        const now = new Date();
        const remainingTime = votingData.nextVote.getTime() - now.getTime();
        const hours = Math.floor(remainingTime / 3600000);
        const minutes = String(Math.floor((remainingTime % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0');
        setRemainingTime(hours > 0 ? `- ${hours}h${minutes}m${seconds}s` : `- ${minutes}m${seconds}s`);
      } else {
        setRemainingTime('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [votingData?.nextVote]);

  return (
    <div className="flex justify-center items-center">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`px-2 py-2 text-white transition duration-300 text-lg text-center border-[3px] ${
          votingData?.hasVoted
            ? 'bg-bgDarkGray border-bgLightGray hover:border-topBorder'
            : 'bg-pinkText border-basePink hover:border-darkPink'
        } ${sizeTag}`}
      >
        {hover && votingData?.hasVoted ? remainingTime : site.title}
      </a>
    </div>
  );
}