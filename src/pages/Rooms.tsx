import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, BedDouble, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Rooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 2,
    type: 'Non-AC',
    price: 5000
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/rooms');
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms', formData);
      setShowModal(false);
      fetchRooms();
      setFormData({ roomNumber: '', capacity: 2, type: 'Non-AC', price: 5000 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Add Room
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.map((room, index) => {
          const pastelColors = [
            'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-pink-50', 
            'bg-purple-50', 'bg-orange-50', 'bg-teal-50', 'bg-red-50',
            'bg-indigo-50', 'bg-lime-50', 'bg-cyan-50', 'bg-rose-50'
          ];
          const bgColor = pastelColors[index % pastelColors.length];
          
          return (
          <div key={room._id} className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-2 rounded-bl-xl text-xs font-bold ${
              room.occupants.length >= room.capacity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {room.occupants.length >= room.capacity ? 'FULL' : 'AVAILABLE'}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/50 text-indigo-600 rounded-lg backdrop-blur-sm">
                <BedDouble size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                <p className="text-sm text-gray-600">{room.type} • ₹{room.price}/mo</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity</span>
                <span className="font-medium text-gray-800">{room.capacity} Students</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occupied</span>
                <span className="font-medium text-gray-800">{room.occupants.length} / {room.capacity}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    room.occupants.length >= room.capacity ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
                ></div>
              </div>

              {/* Occupants List */}
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Occupants</p>
                <div className="flex flex-wrap gap-2">
                  {room.occupants.length > 0 ? (
                    room.occupants.map((occ: any) => (
                      <span key={occ._id} className="px-2 py-1 bg-white/60 text-gray-700 text-xs rounded-md flex items-center gap-1 backdrop-blur-sm">
                        <Users size={12} />
                        {occ.fullName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">Empty room</span>
                  )}
                </div>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                 <button 
                  onClick={() => handleDelete(room._id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        )})}
      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.roomNumber}
                  onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Non-AC">Non-AC</option>
                  <option value="AC">AC</option>
                </select>
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
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
