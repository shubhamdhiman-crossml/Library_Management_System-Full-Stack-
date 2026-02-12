'use client';

import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { useStore } from '@/store';
import { debounce } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import { usersService } from '@/services/users';
import type { User } from '@/types';

export default function Header() {
  const { toggleSidebar, setSearchQuery, currentUser, setCurrentUser } =
    useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  useEffect(() => {
    if (currentUser) {
      return;
    }
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, [currentUser, setCurrentUser]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setUserModalOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setProfileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-violet-600 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, users, or ISBN..."
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {currentUser?.first_name?.[0] ??
                    currentUser?.username?.[0] ??
                    'G'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser
                      ? `${currentUser.first_name} ${currentUser.last_name}`.trim()
                      : 'Guest'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || 'Not signed in'}
                  </p>
                </div>
                <button
                  onClick={() => setUserModalOpen(true)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Switch User
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Select User"
        size="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users?.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <span className="badge badge-info text-xs">{user.role}</span>
            </button>
          ))}
          {!users?.length && (
            <p className="text-sm text-gray-500">No users available.</p>
          )}
        </div>
      </Modal>
    </header>
  );
}
