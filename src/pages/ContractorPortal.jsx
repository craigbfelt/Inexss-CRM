import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Users, Shield, Mail, MapPin, X, Save, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components';
import { userService } from '../services';
import { useAuth, usePermissions, ROLES, LOCATIONS } from '../hooks';

export default function ContractorPortal() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const { userProfile } = useAuth();
  const { isContractor } = usePermissions();

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // Get users with contractor role in the same location
      const data = await userService.getUsersByLocation(userProfile.location);
      setUsers(data.filter(u => u.role === ROLES.CONTRACTOR));
      setError(null);
    } catch (err) {
      console.error('Error loading team members:', err);
      setError('Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowManagement = async () => {
    setShowManagement(true);
    await loadTeamMembers();
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);
      await userService.updateUserProfile(editingUser.id, {
        name: editingUser.name,
        location: editingUser.location,
        is_active: editingUser.is_active,
      });
      
      // Update local state
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
      setError(null);
    } catch (err) {
      console.error('Error updating team member:', err);
      setError('Failed to update team member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isContractor()) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">This portal is only accessible to contractors.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Contractor Portal
        </h1>
        <p className="mt-2 text-gray-600">Manage your team and view your projects</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {userProfile?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{userProfile?.name}</h3>
              <p className="text-gray-600 mt-1">{userProfile?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-green-500 text-green-900">
                  Contractor
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userProfile?.location}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Team Management
            </div>
            {!showManagement && (
              <button
                onClick={handleShowManagement}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                View Team
              </button>
            )}
          </CardTitle>
        </CardHeader>
        {showManagement && (
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4"
              >
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading team members...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No team members found in your location.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div className="ml-4">
                              {editingUser?.id === user.id ? (
                                <input
                                  type="text"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                  className="text-sm font-medium text-gray-900 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              )}
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.id === user.id ? (
                            <select
                              value={editingUser.location}
                              onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                              className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value={LOCATIONS.JHB}>JHB</option>
                              <option value={LOCATIONS.CAPE_TOWN}>Cape Town</option>
                              <option value={LOCATIONS.DURBAN}>Durban</option>
                              <option value={LOCATIONS.OTHER}>Other</option>
                            </select>
                          ) : (
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.id === user.id ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editingUser.is_active}
                                onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString() 
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingUser?.id === user.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleSaveUser}
                                disabled={saving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                <Save className="h-4 w-4" />
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </button>
                            </div>
                          ) : user.id !== userProfile.id ? (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Edit
                            </button>
                          ) : (
                            <span className="text-gray-400">You</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Team Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Pending Tasks</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
