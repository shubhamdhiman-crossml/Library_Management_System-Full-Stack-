'use client';

export default function SettingsPage() {
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
        <div className="card card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Profile & Account
          </h2>
          <p className="text-sm text-gray-600">
            Update your name, email, and password.
          </p>
        </div>

        <div className="card card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Notifications
          </h2>
          <p className="text-sm text-gray-600">
            Configure due date reminders and system alerts.
          </p>
        </div>

        <div className="card card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Library Preferences
          </h2>
          <p className="text-sm text-gray-600">
            Control loan periods, fines, and issue limits.
          </p>
        </div>

        <div className="card card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Access & Roles
          </h2>
          <p className="text-sm text-gray-600">
            Manage staff permissions and user roles.
          </p>
        </div>
      </div>
    </div>
  );
}
