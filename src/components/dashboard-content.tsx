"use client";

import React, { useEffect, useState } from 'react';

const DashboardContent = () => {
  const [serverStatus, setServerStatus] = useState('Loading...');
  const [websiteStatus, setWebsiteStatus] = useState('Loading...');
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const fetchData = () => {
    // Fetch server status
    fetch('/api/server/status')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setServerStatus(data.isOnline ? 'Online' : 'Offline');
        setOnlinePlayers(data.onlinePlayers);
        setLastRefresh(new Date().toLocaleString());
      })
      .catch(() => setServerStatus('Offline'));

    // Fetch website status
    fetch('/api')
      .then(response => {
        if (response.ok) {
          setWebsiteStatus('Online');
        } else {
          setWebsiteStatus('Offline');
        }
      })
      .catch(() => setWebsiteStatus('Offline'));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className={'h-full'}>
      <div className={'w-full flex justify-evenly'}>
        <div className={`w-full h-full ${serverStatus === 'Loading...' ? 'bg-bgLighterGray' : serverStatus === 'Online' ? 'bg-greenText' : 'bg-redText'} p-2 relative m-2`}>
          <h1 className="text-xl font-bold">Serveur Minecraft</h1>
          <p className="text-lg">{serverStatus}</p>
        </div>
        <div className={`w-full h-full ${websiteStatus === 'Loading...' ? 'bg-bgLighterGray' : websiteStatus === 'Online' ? 'bg-greenText' : 'bg-redText'} p-2 relative m-2`}>
          <h1 className="text-xl font-bold">Site web</h1>
          <p className="text-lg">{websiteStatus}</p>
        </div>
        <div className={'w-full h-full bg-bgLighterGray p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Bot Discord</h1>
          <p className="text-lg">Indisponible</p>
        </div>
        <div className={'w-full h-full bg-bgLighterGray p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Joueurs connectés</h1>
          <p className="text-lg">{onlinePlayers}</p>
        </div>
      </div>
      {lastRefresh && <p className="italic text-sm text-gray-500">Last refreshed: {lastRefresh}</p>}
    </div>
  );
};

export default DashboardContent;