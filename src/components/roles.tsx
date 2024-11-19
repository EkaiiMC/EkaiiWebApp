"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

enum Role {
  MAINTAINER = 'MAINTAINER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  WHITELISTER = 'WHITELISTER',
  MEMBER = 'MEMBER',
  USER = 'USER',
}

const affectableRoles = ['USER', 'MEMBER', 'WHITELISTER', 'DESIGNER', 'DEVELOPER'];
const allRoles = Object.values(Role);

interface User {
  id: string;
  name: string;
  image: string;
  role: string;
  createdAt: string;
}

function roleToString(role: string) {
  switch (role) {
    case 'MAINTAINER':
      return 'Mainteneur';
    case 'DEVELOPER':
      return 'Développeur';
    case 'DESIGNER':
      return 'Designer';
    case 'WHITELISTER':
      return 'Whitelisteur';
    case 'MEMBER':
      return 'Membre';
    case 'USER':
      return 'Utilisateur';
    default:
      return 'Inconnu';
  }
}

export default function Roles() {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('name-asc');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUserList(data);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSelectedRole({ ...selectedRole, [userId]: newRole });
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setUserList(prevUserList =>
        prevUserList.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    }
  };

  const filteredUsers = userList
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (roleFilter === '' || user.role === roleFilter)
    )
    .sort((a, b) => {
      const [field, order] = sortOption.split('-');
      if (field === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return order === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className={'bg-bgLighterGray overflow-y-scroll overflow-auto flex-grow p-3 text-lg h-full max-h-[85vh]'}>
      <div className="mb-4 flex flex-row justify-between">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 text-black mr-2"
        />
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-gray-300 text-black mr-2"
          >
            <option value="">Tous les rôles</option>
            {allRoles.map(role => (
              <option key={role} value={role}>{roleToString(role)}</option>
            ))}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 text-black"
          >
            <option value="name-asc">Nom d&apos;utilisateur &#8593;</option>
            <option value="name-desc">Nom d&apos;utilisateur &#8595;</option>
            <option value="createdAt-asc">Date d&apos;inscription &#8593;</option>
            <option value="createdAt-desc">Date d&apos;inscription &#8595;</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className={'w-full bg-bgGray p-2 flex flex-row'}>
            <div className={'h-20 w-20 relative my-auto'}>
              <Image src={user.image!} width={84} height={84} alt={user.name!} className={'aspect-square'}/>
            </div>
            <div className={'ml-4'}>
              <p className={'text-2xl font-bold'}>{user.name!}</p>
              <p className={'text-lg'}>Inscrit le {new Date(user.createdAt!).toLocaleDateString()}</p>
              <p>Grade : {user.role === 'MAINTAINER' ? (
                <span className={'font-bold'}>{roleToString(user.role!)}</span>
              ) : (
                <select
                  value={selectedRole[user.id] || user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="p-1 bg-pinkText text-white hover:bg-selectedPink transition-all duration-500"
                >
                  {affectableRoles.map(role => (
                    <option key={role} value={role} className="custom-option">{roleToString(role)}</option>
                  ))}
                </select>
              )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}