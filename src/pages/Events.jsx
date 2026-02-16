import { Bell } from 'lucide-react';
import { Card, CardTitle } from '../components';

export default function Events() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Events
        </h1>
        <p className="mt-2 text-gray-600">Manage your events and activities</p>
      </div>

      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-apple mb-4">
            <Bell className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="mb-2">Events Module</CardTitle>
          <p className="text-gray-600">This module is coming soon. It will help you track important events.</p>
        </div>
      </Card>
    </div>
  );
}
