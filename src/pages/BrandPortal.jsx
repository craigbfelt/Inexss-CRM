import { Shield, Package, Mail, Phone, Globe, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components';
import { useAuth, usePermissions } from '../hooks';

export default function BrandPortal() {
  const { userProfile } = useAuth();
  const { isBrandRep } = usePermissions();

  if (!isBrandRep()) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">This portal is only accessible to brand representatives.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Brand Representative Portal
        </h1>
        <p className="mt-2 text-gray-600">Manage your brand presence and view projects</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {userProfile?.name?.charAt(0).toUpperCase() || 'B'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{userProfile?.name}</h3>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {userProfile?.email}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-purple-900">
                  <Package className="h-4 w-4" />
                  Brand Representative
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg mb-4 mx-auto w-fit">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Brands Managed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg mb-4 mx-auto w-fit">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg mb-4 mx-auto w-fit">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Client Contacts</div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Brand Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              As a brand representative, you have access to view and manage projects associated with your brands.
              You can track project progress, view client information, and collaborate with the team.
            </p>
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Quick Actions</h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  View projects featuring your brands
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Track project status and timelines
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Access client contact information
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Collaborate with project teams
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
