import { useState, useEffect } from 'react';
import { ContentItem, ContentType } from '../types';
import { ApiService } from '../services/api';
import { Search, Filter, CheckSquare, Square } from 'lucide-react';

interface ContentItemSelectorProps {
  apiService: ApiService;
  selectedItems: ContentItem[];
  onSelectionChange: (items: ContentItem[]) => void;
}

export function ContentItemSelector({ 
  apiService, 
  selectedItems, 
  onSelectionChange 
}: ContentItemSelectorProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading content items and types...');
      
      const [items, types] = await Promise.all([
        apiService.getContentItems().catch(err => {
          console.error('Error loading content items:', err);
          throw new Error(`Failed to load content items: ${err.message}`);
        }),
        apiService.getContentTypes().catch(err => {
          console.error('Error loading content types:', err);
          throw new Error(`Failed to load content types: ${err.message}`);
        })
      ]);
      
      console.log('Content items loaded:', items);
      console.log('Content types loaded:', types);
      
      setContentItems(items);
      setContentTypes(types);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error in loadData:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || item.type.codename === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleItemToggle = (item: ContentItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredItems);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading content items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="content-item-selector">
      <div className="selector-header">
        <h3>Select Content Items</h3>
        <div className="selection-summary">
          {selectedItems.length} of {contentItems.length} items selected
        </div>
      </div>

      <div className="filters">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search content items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="type-filter">
          <Filter size={16} />
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="type-select"
          >
            <option value="all">All Content Types</option>
            {contentTypes.map(type => (
              <option key={type.codename} value={type.codename}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bulk-actions">
        <button
          onClick={handleSelectAll}
          className="select-all-btn"
          disabled={filteredItems.length === 0}
        >
          Select All ({filteredItems.length})
        </button>
        <button
          onClick={handleDeselectAll}
          className="select-all-btn"
          disabled={selectedItems.length === 0}
        >
          Deselect All
        </button>
      </div>

      <div className="items-list">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No content items found.</p>
            {searchTerm && <p>Try adjusting your search terms.</p>}
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`item-row ${selectedItems.some(selected => selected.id === item.id) ? 'selected' : ''}`}
              onClick={() => handleItemToggle(item)}
            >
              <div className="item-checkbox">
                {selectedItems.some(selected => selected.id === item.id) ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
              </div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-details">
                  <span className="item-codename">{item.codename}</span>
                  <span className="item-type">{item.type.codename}</span>
                  {item.lastModified && (
                    <span className="item-modified">
                      Modified: {new Date(item.lastModified).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 