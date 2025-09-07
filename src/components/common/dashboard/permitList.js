
// src/components/dashboard/PermitsList.js
import PermitCard from './permitCard';

const PermitsList = ({ permits, filter, onUpdate }) => {
  if (permits.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filter === 'all' ? 'No permits yet' : `No ${filter.replace('_', ' ')} permits`}
        </h3>
        <p className="text-gray-600">
          {filter === 'all'
            ? 'Get started by submitting your first permit application.'
            : `You don't have any permits with ${STATUS_DISPLAY_NAMES[filter] || filter} status.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permits.map((permit) => (
        <PermitCard key={permit.id} permit={permit} onUpdate={onUpdate} />
      ))}
    </div>
  );
};