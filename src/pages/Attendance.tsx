import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Attendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const attRes = await axios.get(`/api/attendance?date=${selectedDate}`);
      setAttendance(attRes.data);

      if (user?.role === 'admin') {
        const stuRes = await axios.get('/api/students');
        setStudents(stuRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: 'Present' | 'Absent') => {
    try {
      await axios.post('/api/attendance', {
        studentId,
        date: selectedDate,
        status
      });
      fetchData(); // Refresh
    } catch (error) {
      console.error(error);
    }
  };

  const getStatus = (studentId: string) => {
    const record = attendance.find((a: any) => a.student._id === studentId || a.student === studentId);
    return record ? record.status : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
          <Calendar size={20} className="text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-gray-700"
          />
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Roll No</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const status = getStatus(student._id);
                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{student.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{student.rollNumber}</td>
                      <td className="px-6 py-4">
                        {status === 'Present' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Present</span>
                        )}
                        {status === 'Absent' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Absent</span>
                        )}
                        {!status && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">Not Marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAttendance(student._id, 'Present')}
                            className={`p-2 rounded-lg transition-colors ${
                              status === 'Present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                            }`}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'Absent')}
                            className={`p-2 rounded-lg transition-colors ${
                              status === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                            }`}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendance.length > 0 ? (
            attendance.map((record: any) => (
              <div key={record._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{format(new Date(record.date), 'EEEE, MMMM do')}</p>
                  <p className="font-bold text-lg">{format(new Date(record.date), 'yyyy')}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">No attendance records found for this date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
