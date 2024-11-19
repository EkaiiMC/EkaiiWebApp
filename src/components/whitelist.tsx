"use client";

import {useEffect, useState, useRef} from "react";
import Image from "next/image";
import {getPlayerUsernameFromUUID} from "@/mc-utils";

interface WhitelistPlayer {
  playerUuid: string;
  playerName: string;
  isOnline: boolean;
  lastLogin: string;
}

interface AltAccountData {
  belongsTo: string;
  alts: string[];
}

export default function Whitelist({ isMaintainer }: { isMaintainer: boolean }) {
  const [whitelist, setWhitelist] = useState<WhitelistPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('name_asc');
  const [filterOption, setFilterOption] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [playerToDelete, setPlayerToDelete] = useState<WhitelistPlayer | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<WhitelistPlayer | null>(null);
  const [altAccountData, setAltAccountData] = useState<AltAccountData | null>(null);
  const [altSearchQuery, setAltSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<WhitelistPlayer[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const hasFetched = useRef(false);
  const [suggestionPicked, setSuggestionPicked] = useState<boolean>(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch('/api/server/players/whitelist', {cache: 'no-cache'}).then(res => res.json()).then(async data => {
      if (!data.whitelistedPlayers) return;
      const players = await Promise.all(data.whitelistedPlayers.map(async (player: WhitelistPlayer) => {
        if (!player.playerName) {
          player.playerName = await fetch('/api/server/players/from_uuid/' + player.playerUuid, {cache: 'default'})
            .then(res => res.json())
            .then(data => data.player);
        }
        return player;
      }));
      setWhitelist(players);
    });
  }, []);

  const addPlayer = async () => {
    if (newPlayerName.trim() === '') return;
    const res = await fetch('/api/server/players/whitelist/' + newPlayerName, { method: 'POST' });
    if (res.status === 404) {
      setErrorMessage('Le joueur n\'a pas été trouvé');
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setWhitelist([...whitelist, {
        playerUuid: data.playerUuid,
        playerName: newPlayerName,
        isOnline: false,
        lastLogin: "1970-01-01T00:00:00.000Z"
      }]);
      setNewPlayerName('');
      setErrorMessage(null);
    }
  };

  const confirmDeletePlayer = async () => {
    if (playerToDelete) {
      const res = await fetch('/api/server/players/whitelist/' + playerToDelete.playerName, { method: 'DELETE' });
      if (res.ok) {
        setWhitelist(whitelist.filter(p => p.playerUuid !== playerToDelete.playerUuid));
        setShowDeleteConfirmModal(false);
        setPlayerToDelete(null);
      }
    }
  };

  const fetchAltAccountData = async (username: string) => {
    const res = await fetch(`/api/server/players/${username}/alts`);
    if (res.ok) {
      const data = await res.json();
      setAltAccountData(data);
    }
  };

  const handlePlayerClick = (player: WhitelistPlayer) => {
    setSelectedPlayer(player);
    fetchAltAccountData(player.playerName);
    setShowModal(true);
  };

  const addAltAccount = async () => {
    if (altSearchQuery.trim() === '') return;
    const res = await fetch(`/api/server/players/${selectedPlayer?.playerName}/alts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ altAccUsername: altSearchQuery })
    });
    if (res.ok) {
      const data = await res.json();
      setAltAccountData(prev => ({
        ...prev,
        alts: [...(prev?.alts || []), data.username]
      } as AltAccountData));
      setAltSearchQuery('');
    }
  };

  const handleAltSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAltSearchQuery(query);
    setSuggestionPicked(false);
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const filteredSuggestions = whitelist.filter(player =>
      player.playerName.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (player: WhitelistPlayer) => {
    setAltSearchQuery(player.playerName);
    setSuggestions([]);
    setSuggestionPicked(true);
  };

  const filteredWhitelist = whitelist
    .filter(player => player.playerName && player.playerName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(player => filterOption === 'all' || (filterOption === 'online' && player.isOnline) || (filterOption === 'offline' && !player.isOnline))
    .sort((a, b) => {
      let comparison = 0;
      const [sortField, sortDirection] = sortOption.split('_');
      if (sortField === 'name') {
        comparison = a.playerName.localeCompare(b.playerName);
      } else if (sortField === 'lastLogin') {
        comparison = new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const deleteAltAccount = async (altUsername: string) => {
    if (!selectedPlayer) return;
    const res = await fetch(`/api/server/players/${selectedPlayer.playerName}/alts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ altAccUsername: altUsername })
    });
    if (res.ok) {
      setAltAccountData(prev => ({
        ...prev,
        alts: prev?.alts.filter(alt => alt !== altUsername) || []
      } as AltAccountData));
    }
  };

  const addToWhitelistAndAsAlt = async () => {
    if (altSearchQuery.trim() === '') return;

    // Add to whitelist
    const resWhitelist = await fetch('/api/server/players/whitelist/' + altSearchQuery, { method: 'POST' });
    if (resWhitelist.ok) {
      const data = await resWhitelist.json();
      setWhitelist([...whitelist, {
        playerUuid: data.playerUuid,
        playerName: altSearchQuery,
        isOnline: false,
        lastLogin: "1970-01-01T00:00:00.000Z"
      }]);
    }

    // Add as alt
    const resAlt = await fetch(`/api/server/players/${selectedPlayer?.playerName}/alts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ altAccUsername: altSearchQuery })
    });
    if (resAlt.ok) {
      const data = await resAlt.json();
      setAltAccountData(prev => ({
        ...prev,
        alts: [...(prev?.alts || []), data.username]
      } as AltAccountData));
      setAltSearchQuery('');
    }
    setSuggestionPicked(false);
  };

  const handleDeleteButtonClick = (player: WhitelistPlayer) => {
    setPlayerToDelete(player);
    setShowDeleteConfirmModal(true); // Show the confirmation modal
  };

  return (
    <div className={'bg-bgLighterGray overflow-y-scroll overflow-auto flex-grow p-3 text-lg h-full max-h-[85vh]'}>
      <div className="flex mb-4 justify-between flex-wrap">
        <div className={'flex flex-row w-1/4 flex-grow'}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 text-black mr-2"
          />
          <p className={'my-auto'}>{filteredWhitelist.length} joueurs</p>
        </div>
        <div className="flex flex-row">
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-2 border border-gray-300 text-black mr-2">
            <option value="name_asc">Nom &#8593;</option>
            <option value="name_desc">Nom &#8595;</option>
            <option value="lastLogin_asc">Dernière connexion &#8593;</option>
            <option value="lastLogin_desc">Dernière connexion &#8595;</option>
          </select>
          <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)} className="p-2 border border-gray-300 text-black mr-2">
            <option value="all">Tous</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Ajouter un joueur..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="p-2 border border-gray-300 text-black"
          />
          <button onClick={addPlayer} className="text-baseText p-2 border border-basePink hover:bg-pinkText bg-selectedPink transition-all transition-500">Ajouter</button>
        </div>
      </div>
      {errorMessage && <div className="bg-redText mb-4 p-3">{errorMessage}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filteredWhitelist.map(player => (
          <div key={player.playerUuid} className={'w-full bg-bgGray p-2 flex flex-row'} onClick={() => handlePlayerClick(player)}>
            <div className={'h-20 w-20 relative'}>
              <Image src={'https://mc-heads.net/avatar/' + player.playerUuid + '/84'} width={84} height={84} alt={player.playerName} className={'aspect-square'}/>
            </div>
            <div className={'ml-4'}>
              <p className={'text-2xl font-bold'}>{player.playerName}</p>
              <div className={'flex items-center'}>
                <div className={`w-3 h-3 border-2 mr-2 ${player.isOnline ? 'bg-[#67DB29] border-[#178903]' : 'bg-red-500 border-[#8B0000]'}`}/>
                <p className={'text-lg'}>{player.isOnline ? 'En ligne' : 'Hors ligne'}</p>
              </div>
              <p className={'text-lg'}>Dernière connexion: {(() => {
                const date = new Date(player.lastLogin);
                if (date.getTime() === 0) return 'Jamais';
                return date.toLocaleString('fr-FR');
              })()}</p>
            </div>
            {isMaintainer && (
              <div className={'ml-auto my-auto'}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteButtonClick(player);
                  }}
                  className={'bg-red-500 border-[#8B0000] border-2 hover:bg-red-700 hover:border-red-700 text-white p-2 transition-all duration-200'}
                >
                  <Image src={'/images/trash.svg'} width={24} height={24} alt={'Supprimer'}
                         className={'min-w-[24px] min-h-[24px]'}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-bgGray p-4 rounded">
            <p>Êtes vous sûr de vouloir supprimer {playerToDelete?.playerName} de la whitelist?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowDeleteConfirmModal(false)} className="mr-2 p-2 bg-bgLighterGray hover:bg-bgLightGray transition-colors duration-200">Annuler</button>
              <button onClick={confirmDeletePlayer} className="p-2 bg-red-500 hover:bg-red-700 text-white transition-colors duration-200">Confirmer</button>
            </div>
          </div>
        </div>
      )}
      {showModal && selectedPlayer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-bgGray p-4">
            <div className={'flex flex-row content-center'}>
              <Image src={'https://mc-heads.net/avatar/' + selectedPlayer.playerUuid + '/64'} width={64} height={64} alt={selectedPlayer.playerName} className={'aspect-square w-[64px] h-[64px] my-auto mr-2'}/>
              <div className={'my-auto'}>
                <p className={'text-xl font-bold'}>{selectedPlayer.playerName}</p>
                <div className={'flex items-center'}>
                  <div className={`w-3 h-3 border-2 mr-2 ${selectedPlayer.isOnline ? 'bg-[#67DB29] border-[#178903]' : 'bg-red-500 border-[#8B0000]'}`}/>
                  <p className={'text-lg'}>{selectedPlayer.isOnline ? 'En ligne' : 'Hors ligne'}</p>
                </div>
              </div>
            </div>

            {altAccountData ? (
              altAccountData.belongsTo ? (
                <>
                  <p>Second compte de :</p>
                  <p className={'bg-bgLighterGray p-2 flex flex-row'}><Image src={'https://mc-heads.net/avatar/' + altAccountData.belongsTo + '/32'} width={24} height={24} alt={altAccountData.belongsTo} className={'mr-2 w-[24px] h-[24px] my-auto'}/>
                    {altAccountData.belongsTo}</p>
                </>
              ) : (
                <div>
                  <p>Second comptes :</p>
                  <ul className={'mb-3'}>
                    {altAccountData.alts.length > 0 && altAccountData.alts.map(alt => (
                      <li key={alt} className="flex items-center justify-between mt-1 p-2 bg-bgLighterGray">
                        <div className={'flex'}>
                          <Image src={'https://mc-heads.net/avatar/' + alt + '/32'} width={24} height={24} alt={alt} className={'mr-2 w-[24px] h-[24px] my-auto'}/>
                          {alt}
                        </div>
                        <button onClick={() => deleteAltAccount(alt)}
                                className="ml-2 p-1 bg-red-500 hover:bg-red-700 text-white transition-colors duration-200">Delete
                        </button>
                      </li>
                    ))}
                    {altAccountData.alts.length === 0 && <li className={'text-center italic p-2 bg-bgLighterGray'}>Aucun</li>}
                  </ul>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Associer un compte..."
                      value={altSearchQuery}
                      onChange={handleAltSearchChange}
                      className="p-2 border border-gray-300 text-black flex-grow"
                    />
                    <button onClick={addAltAccount} className="ml-2 p-2 bg-green-500 hover:bg-green-700 text-white transition-colors duration-200">Ajouter</button>
                  </div>
                  {(suggestions.length > 0 || altSearchQuery.trim() !== '') && (
                    <ul className="bg-bgLighterGray absolute z-10 w-[250px] max-h-40 overflow-y-auto">
                      {suggestions.map(suggestion => (
                        <li
                          key={suggestion.playerUuid}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-2 cursor-pointer hover:bg-bgLightGray flex items-center"
                        >
                          <Image src={'https://mc-heads.net/avatar/' + suggestion.playerUuid + '/32'} width={24} height={24} alt={suggestion.playerName} className={'mr-2'}/>
                          {suggestion.playerName}
                        </li>
                      ))}
                      {!suggestionPicked && (
                        <li
                          onClick={addToWhitelistAndAsAlt}
                          className="p-2 cursor-pointer hover:bg-bgLightGray flex items-center justify-between"
                        >
                          <span>Ajouter &#34;{altSearchQuery}&#34;</span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )
            ) : (
              <p>Chargement des données...</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="mr-2 p-2 bg-bgLighterGray hover:bg-bgLightGray transition-colors duration-200 rounded">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}