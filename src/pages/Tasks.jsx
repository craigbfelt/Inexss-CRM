import { CheckSquare } from 'lucide-react';
import { Card, CardTitle } from '../components';

export default function Tasks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Tasks
        </h1>
        <p className="mt-2 text-gray-600">Organize and track your tasks</p>
      </div>

      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-apple mb-4">
            <CheckSquare className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="mb-2">Tasks Module</CardTitle>
          <p className="text-gray-600">This module is coming soon. It will help you stay organized and productive.</p>
        </div>
      </Card>
    </div>
  );
}
