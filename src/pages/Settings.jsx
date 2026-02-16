import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardTitle } from '../components';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="mt-2 text-gray-600">Configure your CRM preferences</p>
      </div>

      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-apple mb-4">
            <SettingsIcon className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="mb-2">Settings Module</CardTitle>
          <p className="text-gray-600">This module is coming soon. It will help you customize your CRM.</p>
        </div>
      </Card>
    </div>
  );
}
