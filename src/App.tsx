import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, Info, Save, CheckCircle, XCircle, Key, Trash2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  userKey: string;
  duration: number;
  additionalInfo: string;
  createdAt: Date;
  expiresAt: Date;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [userKey, setUserKey] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers).map((user: User) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        expiresAt: new Date(user.expiresAt)
      })));
    }
  }, []);

  const generateNextId = () => {
    const nextNumber = users.length + 1;
    return nextNumber.toString().padStart(4, '0');
  };

  const calculateExpiryDate = (creationDate: Date, durationDays: number) => {
    const expiryDate = new Date(creationDate);
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    return expiryDate;
  };

  const isExpired = (expiryDate: Date) => {
    return new Date() > new Date(expiryDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const creationDate = new Date();
    const newUser: User = {
      id: generateNextId(),
      username,
      userKey,
      duration: parseInt(duration),
      additionalInfo,
      createdAt: creationDate,
      expiresAt: calculateExpiryDate(creationDate, parseInt(duration))
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUsername('');
    setUserKey('');
    setDuration('');
    setAdditionalInfo('');
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(user => user.id !== userToDelete);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUserToDelete(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#f5f9fa] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-[#007782]/10">
          <h1 className="text-3xl font-bold text-[#007782] mb-8 flex items-center gap-3">
            <Users className="h-8 w-8" />
            Gestion des Utilisateurs
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pseudo
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#007782] focus:ring-[#007782] p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (jours)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#007782] focus:ring-[#007782] p-3 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Clé utilisateur
              </label>
              <input
                type="text"
                required
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#007782] focus:ring-[#007782] p-3 border font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations complémentaires
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#007782] focus:ring-[#007782] p-3 border"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-[#007782] text-white px-6 py-3 rounded-lg hover:bg-[#006670] transition-colors font-medium"
            >
              <Save className="h-5 w-5" />
              Enregistrer
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-[#007782]/10">
          <h2 className="text-2xl font-semibold text-[#007782] mb-6 flex items-center gap-3">
            <Info className="h-6 w-6" />
            Liste des Utilisateurs
          </h2>
          <div className="space-y-4">
            {users.map((user) => {
              const expired = isExpired(user.expiresAt);
              return (
                <div
                  key={user.id}
                  className={`border rounded-xl p-6 transition-all ${
                    expired 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {expired ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          )}
                          <p className="font-semibold text-gray-800">
                            #{user.id} - {user.username}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3 font-mono text-sm break-all">
                          {user.userKey}
                        </div>
                        <p className="text-sm text-gray-600">{user.additionalInfo}</p>
                      </div>
                      <div>
                        {userToDelete === user.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleConfirmDelete}
                              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setUserToDelete(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Créé le: {formatDate(user.createdAt)}
                      </p>
                      <p className={`text-sm flex items-center gap-2 ${
                        expired ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        <CalendarDays className="h-4 w-4" />
                        {expired ? 'Expiré le: ' : 'Expire le: '} 
                        {formatDate(user.expiresAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;