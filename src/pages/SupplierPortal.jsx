import { Shield, Truck, Mail, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components';
import { useAuth, usePermissions } from '../hooks';

export default function SupplierPortal() {
  const { userProfile } = useAuth();
  const { isSupplier } = usePermissions();

  if (!isSupplier()) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">This portal is only accessible to suppliers.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Supplier Portal
        </h1>
        <p className="mt-2 text-gray-600">Track orders, brands, and deliveries</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {userProfile?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{userProfile?.name}</h3>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {userProfile?.email}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-orange-900">
                  <Truck className="h-4 w-4" />
                  Supplier
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg mb-4 mx-auto w-fit">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Active Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg mb-4 mx-auto w-fit">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Pending Deliveries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg mb-4 mx-auto w-fit">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">-</div>
            <div className="text-sm text-gray-600 mt-1">Brands Supplied</div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Supplier Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              As a supplier, you have access to view brands, track orders, and manage deliveries.
              Stay updated on project requirements and maintain seamless communication with the team.
            </p>
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Quick Actions</h4>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  View brands and product information
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  Track active orders and deliveries
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  Access project specifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  Communicate with project managers
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
