'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersService } from '@/services/users';
import { useStore } from '@/store';
import type { User, UserUpdate } from '@/types';

type NotificationSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderDays: number;
};

type LibrarySettings = {
  loanPeriodDays: number;
  finePerDay: number;
  issueLimit: number;
};

const defaultNotifications: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  reminderDays: 3,
};

const defaultLibraryPrefs: LibrarySettings = {
  loanPeriodDays: 14,
  finePerDay: 1,
  issueLimit: 3,
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser } = useStore();
  const isAdmin =
    currentUser?.is_staff ||
    currentUser?.is_superuser ||
    currentUser?.role === 'staff';

  const storageKey = useMemo(
    () => `settings:${currentUser?.id ?? 'guest'}`,
    [currentUser?.id]
  );

  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);
  const [libraryPrefs, setLibraryPrefs] =
    useState<LibrarySettings>(defaultLibraryPrefs);

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
    enabled: isAdmin,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
      usersService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Settings saved');
      if (currentUser?.id === updated.id) {
        setCurrentUser(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<UserUpdate>();

  useEffect(() => {
    if (!currentUser) return;
    reset({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      username: currentUser.username,
      email: currentUser.email,
      phone: currentUser.phone ?? '',
    });
  }, [currentUser, reset]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setNotifications(defaultNotifications);
      setLibraryPrefs(defaultLibraryPrefs);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as {
        notifications?: NotificationSettings;
        libraryPrefs?: LibrarySettings;
      };
      setNotifications(parsed.notifications ?? defaultNotifications);
      setLibraryPrefs(parsed.libraryPrefs ?? defaultLibraryPrefs);
    } catch {
      setNotifications(defaultNotifications);
      setLibraryPrefs(defaultLibraryPrefs);
    }
  }, [storageKey]);

  const saveLocalSettings = (
    nextNotifications: NotificationSettings,
    nextLibraryPrefs: LibrarySettings
  ) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        notifications: nextNotifications,
        libraryPrefs: nextLibraryPrefs,
      })
    );
  };

  const onProfileSubmit = (data: UserUpdate) => {
    if (!currentUser) {
      toast.error('Please select a user first');
      return;
    }
    const payload: UserUpdate = { ...data };
    if (!payload.password) {
      delete payload.password;
    }
    updateUserMutation.mutate({ id: currentUser.id, data: payload });
  };

  const handleNotificationsSave = () => {
    saveLocalSettings(notifications, libraryPrefs);
    toast.success('Notification preferences saved');
  };

  const handleLibraryPrefsSave = () => {
    saveLocalSettings(notifications, libraryPrefs);
    toast.success('Library preferences saved');
  };

  const handleRoleChange = (user: User, role: User['role']) => {
    updateUserMutation.mutate({ id: user.id, data: { role } });
  };

  const handleActiveToggle = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { is_active: !user.is_active },
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage application preferences and account options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-body space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile & Account
            </h2>
            <p className="text-sm text-gray-600">
              Update your name, email, and password.
            </p>
          </div>

          {!currentUser && (
            <p className="text-sm text-amber-600">
              Select a user from the header to edit profile settings.
            </p>
          )}

          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...register('first_name')}
                  className="input"
                  placeholder="First name"
                  disabled={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register('last_name')}
                  className="input"
                  placeholder="Last name"
                  disabled={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  {...register('username')}
                  className="input"
                  placeholder="Username"
                  disabled={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input"
                  placeholder="Email"
                  disabled={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  className="input"
                  placeholder="Phone"
                  disabled={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="input"
                  placeholder="Leave blank to keep current password"
                  disabled={!currentUser}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!currentUser}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        <div className="card card-body space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-sm text-gray-600">
              Configure due date reminders and system alerts.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    email: e.target.checked,
                  }))
                }
              />
              Email notifications
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    sms: e.target.checked,
                  }))
                }
              />
              SMS alerts
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    push: e.target.checked,
                  }))
                }
              />
              Push notifications
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder days before due
              </label>
              <input
                type="number"
                min={0}
                value={notifications.reminderDays}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    reminderDays: Number(e.target.value),
                  }))
                }
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNotificationsSave}
              className="btn btn-primary"
            >
              Save Notifications
            </button>
          </div>
        </div>

        <div className="card card-body space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Library Preferences
            </h2>
            <p className="text-sm text-gray-600">
              Control loan periods, fines, and issue limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Period (days)
              </label>
              <input
                type="number"
                min={1}
                value={libraryPrefs.loanPeriodDays}
                onChange={(e) =>
                  setLibraryPrefs((prev) => ({
                    ...prev,
                    loanPeriodDays: Number(e.target.value),
                  }))
                }
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fine Per Day
              </label>
              <input
                type="number"
                min={0}
                step="0.5"
                value={libraryPrefs.finePerDay}
                onChange={(e) =>
                  setLibraryPrefs((prev) => ({
                    ...prev,
                    finePerDay: Number(e.target.value),
                  }))
                }
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Limit
              </label>
              <input
                type="number"
                min={1}
                value={libraryPrefs.issueLimit}
                onChange={(e) =>
                  setLibraryPrefs((prev) => ({
                    ...prev,
                    issueLimit: Number(e.target.value),
                  }))
                }
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLibraryPrefsSave}
              className="btn btn-primary"
            >
              Save Preferences
            </button>
          </div>
        </div>

        <div className="card card-body space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Access & Roles
            </h2>
            <p className="text-sm text-gray-600">
              Manage staff permissions and user roles.
            </p>
          </div>

          {!isAdmin && (
            <p className="text-sm text-amber-600">
              Admin access required to manage roles.
            </p>
          )}

          {isAdmin && (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user,
                              e.target.value as User['role']
                            )
                          }
                          className="input"
                        >
                          <option value="student">Student</option>
                          <option value="staff">Staff</option>
                          <option value="external">External</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleActiveToggle(user)}
                          className={`badge ${
                            user.is_active ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!users?.length && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">
                        No users available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
