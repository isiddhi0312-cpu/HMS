import React from 'react';
import { Phone, Wrench, Zap, Droplet, Shield, UserCog, Stethoscope } from 'lucide-react';

export default function Contacts() {
  const contacts = [
    {
      role: 'Warden',
      name: 'Mr. Rajesh Kumar',
      phone: '+91 98765 43210',
      available: '24x7',
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      role: 'Electrician',
      name: 'Suresh Electric',
      phone: '+91 98765 43211',
      available: '9 AM - 6 PM',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      role: 'Plumber',
      name: 'Ramesh Pipes',
      phone: '+91 98765 43212',
      available: '9 AM - 6 PM',
      icon: Droplet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      role: 'Carpenter',
      name: 'Mahesh Woodworks',
      phone: '+91 98765 43213',
      available: '10 AM - 5 PM',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      role: 'Mess Manager',
      name: 'Mr. Gupta',
      phone: '+91 98765 43214',
      available: '7 AM - 10 PM',
      icon: UserCog,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      role: 'Medical Emergency',
      name: 'Campus Clinic',
      phone: '+91 98765 43215',
      available: '24x7',
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Phone className="text-indigo-600" />
        Important Contacts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <div key={index} className={`${contact.bgColor} p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-transform hover:-translate-y-1`}>
            <div className={`p-3 rounded-lg bg-white/60 shadow-sm`}>
              <contact.icon className={`w-6 h-6 ${contact.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{contact.role}</h3>
              <p className="text-gray-600 font-medium mb-1">{contact.name}</p>
              
              <div className="mt-3 flex items-center gap-2">
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors shadow-sm">
                  <Phone size={14} />
                  {contact.phone}
                </a>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Available: {contact.available}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-red-700">Emergency Helpline</h3>
          <p className="text-red-600 text-sm">For fire, medical, or security emergencies inside campus.</p>
        </div>
        <a href="tel:112" className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition-colors">
          Call 112
        </a>
      </div>
    </div>
  );
}
