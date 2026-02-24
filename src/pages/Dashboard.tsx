import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, BedDouble, CheckCircle, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, roomsRes, attendanceRes] = await Promise.all([
          axios.get('/api/students'),
          axios.get('/api/rooms'),
          axios.get('/api/attendance/stats')
        ]);

        const totalRooms = roomsRes.data.length;
        const occupiedRooms = roomsRes.data.filter((r: any) => r.occupants.length > 0).length;

        setStats({
          totalStudents: studentsRes.data.length,
          totalRooms,
          occupiedRooms,
          presentToday: attendanceRes.data.present,
          absentToday: attendanceRes.data.absent
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const attendanceData = [
    { name: 'Present', value: stats.presentToday },
    { name: 'Absent', value: stats.absentToday },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {user?.role === 'admin' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Students" 
              value={stats.totalStudents} 
              icon={Users} 
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard 
              title="Total Rooms" 
              value={stats.totalRooms} 
              icon={BedDouble} 
              color="text-indigo-600"
              bgColor="bg-indigo-50"
            />
            <StatCard 
              title="Occupied Rooms" 
              value={stats.occupiedRooms} 
              icon={CheckCircle} 
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <StatCard 
              title="Absent Today" 
              value={stats.absentToday} 
              icon={AlertCircle} 
              color="text-red-600"
              bgColor="bg-red-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Chart */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Today's Attendance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white/60 text-indigo-700 rounded-lg hover:bg-white transition-colors text-left shadow-sm">
                  <span className="block font-semibold">Add Student</span>
                  <span className="text-sm opacity-75">Register new admission</span>
                </button>
                <button className="p-4 bg-white/60 text-emerald-700 rounded-lg hover:bg-white transition-colors text-left shadow-sm">
                  <span className="block font-semibold">Mark Attendance</span>
                  <span className="text-sm opacity-75">For today</span>
                </button>
                <button className="p-4 bg-white/60 text-purple-700 rounded-lg hover:bg-white transition-colors text-left shadow-sm">
                  <span className="block font-semibold">Assign Room</span>
                  <span className="text-sm opacity-75">Manage allocation</span>
                </button>
                <button className="p-4 bg-white/60 text-orange-700 rounded-lg hover:bg-white transition-colors text-left shadow-sm">
                  <span className="block font-semibold">View Complaints</span>
                  <span className="text-sm opacity-75">Check pending issues</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-blue-50 p-8 rounded-xl shadow-sm border border-blue-100 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Student Dashboard</h2>
          <p className="text-gray-600">Welcome to your student portal. Use the sidebar to check your attendance, view room details, or submit complaints.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <div className={`${bgColor || 'bg-white'} p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4`}>
      <div className={`p-3 rounded-lg bg-white/60`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
