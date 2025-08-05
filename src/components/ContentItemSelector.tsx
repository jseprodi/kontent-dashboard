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
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, types] = await Promise.all([
        apiService.getContentItems(),
        apiService.getContentTypes()
      ]);
      setContentItems(items);
      setContentTypes(types);
    } catch (err) {
      setError('Failed to load content items');
      console.error(err);
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

        <div className="bulk-actions">
          <button onClick={handleSelectAll} className="select-all-btn">
            Select All
          </button>
          <button onClick={handleDeselectAll} className="deselect-all-btn">
            Deselect All
          </button>
        </div>
      </div>

      <div className="items-list">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No content items found matching your criteria.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isSelected = selectedItems.some(selected => selected.id === item.id);
            return (
              <div
                key={item.id}
                className={`item-row ${isSelected ? 'selected' : ''}`}
                onClick={() => handleItemToggle(item)}
              >
                <div className="item-checkbox">
                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    <span className="item-codename">{item.codename}</span>
                    <span className="item-type">{item.type.codename}</span>
                    <span className="item-language">{item.language.codename}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 