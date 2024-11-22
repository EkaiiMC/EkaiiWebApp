"use client";

import { useEffect, useRef, useState } from "react";

interface APIScope {
  [key: string]: APIScope | boolean | { selected: boolean };
}

interface APIKey {
  name: string;
  scopes: APIScope;
  createdAt: string;
  key?: string;
}

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<APIKey | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<string[]>([]);
  const [expandedScopes, setExpandedScopes] = useState<string[][]>([]);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const fetchKeys = async () => {
      const res = await fetch('/api/auth/api-keys');
      const data: string[] = await res.json();
      for (const key of data) {
        const res = await fetch('/api/auth/api-keys/' + key);
        const data = await res.json();
        setKeys((keys) => [...keys, data]);
      }
    };
    fetchKeys();
  }, []);

  const handleDelete = async () => {
    if (keyToDelete) {
      await fetch(`/api/auth/api-keys/${keyToDelete}`, { method: 'DELETE' });
      setKeys(keys.filter(key => key.name !== keyToDelete));
      setShowDeleteModal(false);
      setKeyToDelete(null);
    }
  };

  const confirmDelete = (name: string) => {
    setKeyToDelete(name);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  const handleSave = async () => {
    if (currentKey) {
      if (isCreating) {
        const res = await fetch('/api/auth/api-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentKey)
        });
        const newKey = await res.json();
        setKeys([...keys, newKey]);
        setNewlyCreatedKey(newKey.key);
      } else {
        const res = await fetch(`/api/auth/api-keys/${currentKey.name}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentKey)
        });
        const updatedKey = await res.json();
        console.log(updatedKey);
        setKeys(keys.map(key => key.name === updatedKey.name ? updatedKey : key));
      }
      setShowEditModal(false);
      setCurrentKey(null);
      setIsCreating(false);
    }
  };

  const openCreateModal = () => {
    setCurrentKey({ name: '', scopes: {}, createdAt: new Date().toISOString() });
    setIsCreating(true);
    setShowEditModal(true);
  };

  const handleEdit = (key: APIKey) => {
    setCurrentKey(key);
    setIsCreating(false);
    setShowEditModal(true);
  };

  const addScope = () => {
    const newScopes = { ...currentKey!.scopes };
    let scope = newScopes;
    for (let i = 0; i < selectedScope.length; i++) {
      if (typeof scope[selectedScope[i]] === 'boolean') {
        scope[selectedScope[i]] = {};
      }
      scope = scope[selectedScope[i]] as APIScope;
    }
    const defaultScopeName = `newScope${Object.keys(scope).length}`;
    if (selectedScope.length === 0) {
      newScopes[defaultScopeName] = true;
    } else {
      scope[defaultScopeName] = true;
    }
    setCurrentKey({ ...currentKey!, scopes: newScopes });
  };

  const deleteScope = () => {
    if (selectedScope.length === 0) return;
    const newScopes = { ...currentKey!.scopes };
    let scope = newScopes;
    for (let i = 0; i < selectedScope.length - 1; i++) {
      scope = scope[selectedScope[i]] as APIScope;
    }
    delete scope[selectedScope[selectedScope.length - 1]];
    setCurrentKey({ ...currentKey!, scopes: newScopes });
    setSelectedScope([]);
  };

  const toggleSelectScope = (path: string[]) => {
    if (JSON.stringify(selectedScope) === JSON.stringify(path)) {
      setSelectedScope([]);
    } else {
      setSelectedScope(path);
    }
  };

  const toggleExpandScope = (path: string[]) => {
    if (expandedScopes.some(expandedPath => JSON.stringify(expandedPath) === JSON.stringify(path))) {
      setExpandedScopes(expandedScopes.filter(expandedPath => JSON.stringify(expandedPath) !== JSON.stringify(path)));
    } else {
      setExpandedScopes([...expandedScopes, path]);
    }
  };

  const renderScopes = (scopes: APIScope, path: string[] = []) => {
    return (
      <div>
        {Object.entries(scopes).map(([key, value]) => {
          const currentPath = [...path, key];
          const isSelected = JSON.stringify(selectedScope) === JSON.stringify(currentPath);
          const isExpanded = expandedScopes.some(expandedPath => JSON.stringify(expandedPath) === JSON.stringify(currentPath));
          const inputClass = `block text-sm font-medium text-baseText ${isSelected ? 'bg-pinkText' : 'bg-bgLighterGray'} p-1`;
          const inputKey = currentPath.join('.');

          return (
            <div key={inputKey} className={`ml-4`}>
              <div className="flex items-center">
                <button onClick={() => toggleExpandScope(currentPath)} className="mr-2 w-2">
                  {isExpanded ? '-' : '+'}
                </button>
                <input
                  type="text"
                  value={key}
                  ref={(el) => { inputRefs.current[inputKey] = el; }}
                  onClick={() => toggleSelectScope(currentPath)}
                  onChange={(e) => {
                    const newScopes = { ...currentKey!.scopes };
                    let scope = newScopes;
                    for (let i = 0; i < path.length; i++) {
                      scope = scope[path[i]] as APIScope;
                    }
                    const newKey = e.target.value;
                    scope[newKey] = scope[key];
                    delete scope[key];
                    setCurrentKey({ ...currentKey!, scopes: newScopes });
                  }}
                  className={inputClass}
                />
              </div>
              {isExpanded && typeof value === 'object' && renderScopes(value, currentPath)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={'bg-bgLighterGray overflow-y-scroll overflow-auto flex-grow p-3 text-lg h-full max-h-[85vh] transition-colors duration-500'}>
      <button onClick={openCreateModal} className="bg-greenText hover:bg-green-700 p-2 mb-4 transition-colors duration-500">Créer une clé</button>
      <table className="min-w-full">
        <thead>
        <tr>
          <th className="px-6 py-3 text-left">Nom</th>
          <th className="px-6 py-3 text-left">Créé le</th>
          <th className="px-6 py-3 text-left">Clé</th>
          <th className="px-6 py-3 text-left">Options</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-bgDarkGray">
        {keys.map((key) => (
          <tr key={key.name}>
            <td className="px-6 py-4 whitespace-nowrap">{key.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{new Date(Date.parse(key.createdAt)).toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {newlyCreatedKey && key.key === newlyCreatedKey ? key.key : '*'.repeat(36)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button onClick={() => handleEdit(key)} className="bg-indigo-600 hover:bg-indigo-900 p-1 px-2 transition-colors duration-500">Modifier</button>
              <button onClick={() => confirmDelete(key.name)} className="bg-red-600 hover:bg-red-900 ml-4 p-1 px-2 transition-colors duration-500">Supprimer</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-bgGray text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-bgGray px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-zinc-400">Confirmer la suppression</h3>
                    <div className="mt-2">
                      <p className="text-sm text-baseText">Êtes vous sûr de vouloir supprimer cette clé ? Cette action est irréversible.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-bgLightGray px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleDelete} className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Supprimer</button>
                <button onClick={cancelDelete} className="mt-3 w-full inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-bgGray text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-bgGray px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-xl leading-6 font-medium text-zinc-400">
                      {isCreating ? 'Créer la clé' : 'Modifier la clé'}
                    </h3>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-baseText">Nom</label>
                      <input
                        type="text"
                        value={currentKey?.name || ''}
                        onChange={(e) => setCurrentKey({ ...currentKey!, name: e.target.value })}
                        className="mt-1 block w-full sm:text-sm bg-bgLighterGray border-bgLighterGray text-white p-1"
                      />
                      <label className="block text-sm font-medium text-baseText mt-4">
                        Permissions
                        <button onClick={addScope}
                                className="ml-4 bg-green-600 hover:bg-green-700 p-1 px-2 transition-colors duration-500">+</button>
                        <button onClick={deleteScope}
                                className="ml-2 bg-red-600 hover:bg-red-700 p-1 px-2 transition-colors duration-500">-
                        </button>
                      </label>
                      <div className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        {currentKey && renderScopes(currentKey.scopes)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-bgLightGray px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleSave}
                        className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-500">{isCreating ? 'Create' : 'Save'}</button>
                <button onClick={() => setShowEditModal(false)} className="mt-3 w-full inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-500">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}