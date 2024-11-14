"use client";

import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';

interface CounterProps {
  lowerBound: number;
  upperBound: number;
}

export default function Counter ({ lowerBound, upperBound, content } : { lowerBound : number, upperBound : number, content : string }) {
  const countUpRef = useRef<HTMLHRElement>(null);

  useEffect(() => {
    if (countUpRef.current) {
      const countUp = new CountUp(countUpRef.current, upperBound, {
        startVal: lowerBound,
        duration: 2,
      });
      countUp.start();
    }
  }, [lowerBound, upperBound]);

  return (
    <div className={'border-[3px] bg-basePink border-darkPink text-lg w-[200px] navbar:w-[250px] min-[1400px]:w-[350px] flex flex-col justify-between p-3 my-3 shadow-2xl'}>
        <h2 className={'text-5xl min-[1400px]:text-7xl mx-auto font-monocraft pl-2'} ref={countUpRef}/>
        <h3 className={'text-xl navbar:text-2xl min-[1400px]:text-4xl mx-auto font-semibold mt-1 navbar:mt-3'}>{content}</h3>
    </div>
  );
};

