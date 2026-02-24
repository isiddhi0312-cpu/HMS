import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquareWarning, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Electricity',
    description: '',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints');
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/complaints', formData);
      setShowModal(false);
      fetchComplaints();
      setFormData({ category: 'Electricity', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit complaint. Ensure you have a student profile linked.');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`/api/complaints/${id}`, { status });
      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
        {user?.role === 'student' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <MessageSquareWarning size={20} />
            New Complaint
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <MessageSquareWarning className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No complaints found.</p>
          </div>
        ) : (
          complaints.map((complaint, index) => {
            const pastelColors = [
              'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-pink-50', 
              'bg-purple-50', 'bg-orange-50', 'bg-teal-50', 'bg-red-50'
            ];
            const bgColor = pastelColors[index % pastelColors.length];
            
            return (
            <div key={complaint._id} className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-100`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(complaint.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                {user?.role === 'admin' && (
                  <select
                    value={complaint.status}
                    onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    className="text-sm border-gray-200 rounded-lg focus:ring-indigo-500 bg-white/50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                )}
              </div>

              <h3 className="font-bold text-gray-800 mb-1">{complaint.category} Issue</h3>
              <p className="text-gray-700 mb-4">{complaint.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-200/50 pt-4">
                <span className="font-medium">Raised by:</span>
                <span>{complaint.student?.fullName || 'Unknown Student'}</span>
                {complaint.student?.roomNumber && (
                  <span className="bg-white/60 px-2 py-0.5 rounded text-xs backdrop-blur-sm">Room {complaint.student.roomNumber}</span>
                )}
              </div>
            </div>
          )})
        )}
      </div>

      {/* New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Submit Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2 border rounded-lg"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
