import React from 'react';

const FeatureCard = ({ icon, title, description, status }) => (
  <div className="card">
    <div className="card-body">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-secondary-800 mb-1">{title}</h4>
          <p className="text-sm text-secondary-600 mb-3">{description}</p>
          <span className={`badge-${status === 'ready' ? 'success' : 'warning'}`}>
            {status === 'ready' ? 'Ready' : 'Coming Soon'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const FeatureShowcase = () => {
  const features = [
    {
      icon: '🍽️',
      title: 'Menu Management',
      description: 'Add, edit, and organize your restaurant menu items with categories and pricing.',
      status: 'coming'
    },
    {
      icon: '📋',
      title: 'Order Processing',
      description: 'Streamline order taking and kitchen communication with real-time updates.',
      status: 'coming'
    },
    {
      icon: '🪑',
      title: 'Table Management',
      description: 'Track table availability, reservations, and seating arrangements.',
      status: 'coming'
    },
    {
      icon: '👥',
      title: 'Staff Management',
      description: 'Manage staff schedules, roles, and performance tracking.',
      status: 'coming'
    },
    {
      icon: '📦',
      title: 'Inventory Tracking',
      description: 'Monitor ingredient levels and get alerts for low stock items.',
      status: 'coming'
    },
    {
      icon: '📊',
      title: 'Sales Analytics',
      description: 'View detailed reports on sales, popular items, and revenue trends.',
      status: 'coming'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-800 mb-6">
        🚀 Planned Features
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase;