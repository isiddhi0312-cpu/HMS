import React from 'react';
import { Utensils, Coffee, Sun, Moon, Clock } from 'lucide-react';

export default function MessMenu() {
  const menu = [
    {
      day: 'Monday',
      breakfast: 'Aloo Paratha, Curd, Tea/Coffee',
      lunch: 'Rajma Chawal, Roti, Salad, Raita',
      snacks: 'Samosa, Tea',
      dinner: 'Mix Veg, Dal Tadka, Rice, Roti, Kheer'
    },
    {
      day: 'Tuesday',
      breakfast: 'Poha, Jalebi, Milk',
      lunch: 'Chole Bhature, Rice, Salad',
      snacks: 'Biscuits, Tea',
      dinner: 'Egg Curry / Paneer Butter Masala, Rice, Roti'
    },
    {
      day: 'Wednesday',
      breakfast: 'Idli Sambar, Chutney, Coffee',
      lunch: 'Kadhi Pakora, Jeera Rice, Roti',
      snacks: 'Bread Pakora, Tea',
      dinner: 'Chicken Curry / Malai Kofta, Rice, Naan'
    },
    {
      day: 'Thursday',
      breakfast: 'Sandwich, Boiled Egg, Juice',
      lunch: 'Dal Makhani, Rice, Roti, Salad',
      snacks: 'Maggi, Coffee',
      dinner: 'Aloo Gobi, Dal Fry, Rice, Roti, Gulab Jamun'
    },
    {
      day: 'Friday',
      breakfast: 'Puri Bhaji, Tea',
      lunch: 'Veg Biryani, Raita, Papad',
      snacks: 'Pasta, Cold Drink',
      dinner: 'Fish Curry / Shahi Paneer, Rice, Roti'
    },
    {
      day: 'Saturday',
      breakfast: 'Uttapam, Coconut Chutney, Coffee',
      lunch: 'Khichdi, Aloo Chokha, Pickle, Papad',
      snacks: 'Fruit Chat',
      dinner: 'Fried Rice, Manchurian, Noodles'
    },
    {
      day: 'Sunday',
      breakfast: 'Chole Kulche, Lassi',
      lunch: 'Special Thali (Paneer, Dal, Rice, Roti, Sweet)',
      snacks: 'Cake/Pastry, Coffee',
      dinner: 'Light Khichdi / Porridge (Detox)'
    }
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Utensils className="text-orange-500" />
        Mess Menu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item, index) => {
          const isToday = item.day === today;
          const pastelColors = [
            'bg-orange-50', 'bg-yellow-50', 'bg-green-50', 'bg-blue-50', 
            'bg-purple-50', 'bg-pink-50', 'bg-red-50'
          ];
          const bgColor = pastelColors[index % pastelColors.length];

          return (
            <div 
              key={item.day} 
              className={`${bgColor} p-6 rounded-xl shadow-sm border ${isToday ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-100'} relative`}
            >
              {isToday && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  TODAY
                </span>
              )}
              
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200/50 pb-2">{item.day}</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 bg-white/60 p-1.5 rounded-lg h-fit">
                    <Sun size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Breakfast</p>
                    <p className="text-sm text-gray-700 font-medium">{item.breakfast}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 bg-white/60 p-1.5 rounded-lg h-fit">
                    <Utensils size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Lunch</p>
                    <p className="text-sm text-gray-700 font-medium">{item.lunch}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 bg-white/60 p-1.5 rounded-lg h-fit">
                    <Coffee size={16} className="text-brown-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Snacks</p>
                    <p className="text-sm text-gray-700 font-medium">{item.snacks}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 bg-white/60 p-1.5 rounded-lg h-fit">
                    <Moon size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Dinner</p>
                    <p className="text-sm text-gray-700 font-medium">{item.dinner}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="text-gray-400" />
          Mess Timings
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Breakfast</p>
            <p className="text-lg font-bold text-gray-800">7:30 - 9:00 AM</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Lunch</p>
            <p className="text-lg font-bold text-gray-800">12:30 - 2:00 PM</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Snacks</p>
            <p className="text-lg font-bold text-gray-800">5:00 - 6:00 PM</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Dinner</p>
            <p className="text-lg font-bold text-gray-800">8:00 - 9:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
