import React from 'react';
import { useEmail } from '../hooks/use-email';

const FilterBar: React.FC = () => {
  const { filter, setFilter } = useEmail();

  return (
    <div className="filter-bar">
      <button
        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
        onClick={() => setFilter('unread')}
      >
        Unread
      </button>
      <button
        className={`filter-button ${filter === 'read' ? 'active' : ''}`}
        onClick={() => setFilter('read')}
      >
        Read
      </button>
      <button
        className={`filter-button ${filter === 'favorites' ? 'active' : ''}`}
        onClick={() => setFilter('favorites')}
      >
        Favorites
      </button>
    </div>
  );
};

export default FilterBar;
