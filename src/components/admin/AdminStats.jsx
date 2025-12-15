import React from 'react';
import { DollarSign, CreditCard, Users, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex items-center text-sm">
            <span className={`font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
        </div>
    </div>
);

const AdminStats = () => {
    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            change: '+20.1%',
            trend: 'up',
            icon: DollarSign
        },
        {
            title: 'Total Sales',
            value: '+12,234',
            change: '+19%',
            trend: 'up',
            icon: CreditCard
        },
        {
            title: 'New Users',
            value: '+2350',
            change: '+180.1%',
            trend: 'up',
            icon: Users
        },
        {
            title: 'Website Activity',
            value: '+573',
            change: '+201',
            trend: 'up',
            icon: Activity // Using Activity as proxy for graph/heatmap icon
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default AdminStats;
