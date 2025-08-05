import { useState, useEffect } from 'react';
import { User } from '../types';
import { ApiService } from '../services/api';
import { Search, Users, CheckSquare, Square, X } from 'lucide-react';

interface ContributorSelectorProps {
  apiService: ApiService;
  selectedContributors: User[];
  onSelectionChange: (contributors: User[]) => void;
}

export function ContributorSelector({ 
  apiService, 
  selectedContributors, 
  onSelectionChange 
}: ContributorSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchLower))
    );
  });

  const handleUserToggle = (user: User) => {
    const isSelected = selectedContributors.some(selected => selected.id === user.id);
    if (isSelected) {
      onSelectionChange(selectedContributors.filter(selected => selected.id !== user.id));
    } else {
      onSelectionChange([...selectedContributors, user]);
    }
  };

  const handleRemoveContributor = (userId: string) => {
    onSelectionChange(selectedContributors.filter(contributor => contributor.id !== userId));
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredUsers);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadUsers} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="contributor-selector">
      <div className="selector-header">
        <h3>Select Contributors</h3>
        <div className="selection-summary">
          {selectedContributors.length} contributors selected
        </div>
      </div>

      <div className="filters">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="bulk-actions">
          <button onClick={handleSelectAll} className="select-all-btn">
            Select All
          </button>
          <button onClick={handleDeselectAll} className="deselect-all-btn">
            Deselect All
          </button>
        </div>
      </div>

      <div className="selected-contributors">
        {selectedContributors.length > 0 && (
          <div className="selected-list">
            <h4>Selected Contributors:</h4>
            <div className="contributor-tags">
              {selectedContributors.map(contributor => (
                <div key={contributor.id} className="contributor-tag">
                  <span className="contributor-name">
                    {contributor.fullName || contributor.email}
                  </span>
                  <button
                    onClick={() => handleRemoveContributor(contributor.id)}
                    className="remove-btn"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <Users size={24} />
            <p>No users found matching your search.</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const isSelected = selectedContributors.some(selected => selected.id === user.id);
            return (
              <div
                key={user.id}
                className={`user-row ${isSelected ? 'selected' : ''}`}
                onClick={() => handleUserToggle(user)}
              >
                <div className="user-checkbox">
                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name'}
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 