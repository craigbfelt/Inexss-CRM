import { motion } from 'framer-motion';
import { Users, Target, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { 
    name: 'Total Contacts', 
    value: '2,543', 
    change: '+12.5%', 
    positive: true, 
    icon: Users,
    color: 'from-blue-500 to-blue-600' 
  },
  { 
    name: 'Active Leads', 
    value: '1,284', 
    change: '+8.3%', 
    positive: true, 
    icon: Target,
    color: 'from-purple-500 to-purple-600' 
  },
  { 
    name: 'Projects', 
    value: '156', 
    change: '-2.1%', 
    positive: false, 
    icon: Briefcase,
    color: 'from-indigo-500 to-indigo-600' 
  },
  { 
    name: 'Revenue', 
    value: '$45.2K', 
    change: '+23.4%', 
    positive: true, 
    icon: TrendingUp,
    color: 'from-green-500 to-green-600' 
  },
];

const revenueData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 35000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 42000 },
  { month: 'May', revenue: 45000 },
  { month: 'Jun', revenue: 45200 },
];

const leadsData = [
  { name: 'Mon', leads: 120 },
  { name: 'Tue', leads: 150 },
  { name: 'Wed', leads: 180 },
  { name: 'Thu', leads: 140 },
  { name: 'Fri', leads: 190 },
  { name: 'Sat', leads: 80 },
  { name: 'Sun', leads: 60 },
];

const projectsData = [
  { status: 'Planning', count: 45 },
  { status: 'In Progress', count: 78 },
  { status: 'Review', count: 23 },
  { status: 'Completed', count: 10 },
];

const activities = [
  { id: 1, type: 'contact', message: 'New contact added: John Smith', time: '2 minutes ago' },
  { id: 2, type: 'lead', message: 'Lead qualified: Acme Corp', time: '15 minutes ago' },
  { id: 3, type: 'project', message: 'Project milestone completed', time: '1 hour ago' },
  { id: 4, type: 'task', message: 'Task assigned to team member', time: '2 hours ago' },
  { id: 5, type: 'event', message: 'Meeting scheduled with client', time: '3 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card gradient hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`mt-2 flex items-center text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.positive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-apple`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#007AFF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                  }} 
                />
                <Bar dataKey="leads" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5856D6" />
                    <stop offset="100%" stopColor="#AF52DE" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Projects Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectsData} layout="vertical">
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="status" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                  }} 
                />
                <Bar dataKey="count" fill="#007AFF" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-200/50 last:border-0 last:pb-0">
                  <div className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-apple-blue to-apple-purple" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
