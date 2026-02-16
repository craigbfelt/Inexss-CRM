import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardTitle } from '../components';

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Calendar
        </h1>
        <p className="mt-2 text-gray-600">View and schedule your appointments</p>
      </div>

      <Card className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-apple mb-4">
            <CalendarIcon className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="mb-2">Calendar Module</CardTitle>
          <p className="text-gray-600">This module is coming soon. It will help you manage your schedule.</p>
        </div>
      </Card>
    </div>
  );
}
