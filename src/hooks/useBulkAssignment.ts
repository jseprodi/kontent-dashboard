import { useState, useCallback } from 'react';
import { User, ContentItem, AssignmentRequest, AssignmentResult } from '../types';
import { ApiService } from '../services/api';

export interface UseBulkAssignmentProps {
  apiService: ApiService;
}

export interface UseBulkAssignmentReturn {
  selectedContentItems: ContentItem[];
  selectedContributors: User[];
  isAssigning: boolean;
  assignmentResults: AssignmentResult[];
  setSelectedContentItems: (items: ContentItem[]) => void;
  setSelectedContributors: (contributors: User[]) => void;
  assignContributors: () => Promise<void>;
  clearResults: () => void;
  resetSelection: () => void;
}

export function useBulkAssignment({ apiService }: UseBulkAssignmentProps): UseBulkAssignmentReturn {
  const [selectedContentItems, setSelectedContentItems] = useState<ContentItem[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<User[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResults, setAssignmentResults] = useState<AssignmentResult[]>([]);

  const assignContributors = useCallback(async () => {
    if (selectedContentItems.length === 0 || selectedContributors.length === 0) {
      return;
    }

    setIsAssigning(true);
    setAssignmentResults([]);

    try {
      const assignments: AssignmentRequest[] = selectedContentItems.map(item => {
        // Handle cases where language might not be available
        const languageCodename = item.language?.codename || 'default';
        
        console.log(`Creating assignment for item ${item.id} (${item.name}) with language: ${languageCodename}`);
        
        return {
          contentItemId: item.id,
          languageCodename: languageCodename,
          contributors: selectedContributors.map(contributor => contributor.email),
        };
      });

      console.log('Bulk assignment requests:', assignments);

      const results = await apiService.bulkAssignContributors(assignments);
      setAssignmentResults(results);
    } catch (error) {
      console.error('Error during bulk assignment:', error);
      setAssignmentResults([{
        contentItemId: 'general',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }]);
    } finally {
      setIsAssigning(false);
    }
  }, [selectedContentItems, selectedContributors, apiService]);

  const clearResults = useCallback(() => {
    setAssignmentResults([]);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedContentItems([]);
    setSelectedContributors([]);
    setAssignmentResults([]);
  }, []);

  return {
    selectedContentItems,
    selectedContributors,
    isAssigning,
    assignmentResults,
    setSelectedContentItems,
    setSelectedContributors,
    assignContributors,
    clearResults,
    resetSelection,
  };
} 