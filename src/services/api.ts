import axios, { AxiosInstance } from 'axios';
import {
  User,
  ContentItem,
  ContentType,
  AssignmentRequest,
  SubscriptionApiResponse,
  ManagementApiResponse,
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest
} from '../types';

export class ApiService {
  private subscriptionApi: AxiosInstance;
  private managementApi: AxiosInstance;

  constructor(
    subscriptionApiKey: string,
    managementApiKey: string,
    environmentId: string,
    subscriptionId: string
  ) {
    this.subscriptionApi = axios.create({
      baseURL: `https://manage.kontent.ai/v2/subscriptions/${subscriptionId}`,
      headers: {
        'Authorization': `Bearer ${subscriptionApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.managementApi = axios.create({
      baseURL: `https://manage.kontent.ai/v2/projects/${environmentId}`,
      headers: {
        'Authorization': `Bearer ${managementApiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get users from the subscription
   */
  async getUsers(): Promise<User[]> {
    try {
      console.log('Making request to users API...');
      console.log('Subscription API base URL:', this.subscriptionApi.defaults.baseURL);
      
      const response = await this.subscriptionApi.get<SubscriptionApiResponse<User[]>>('/users');
      
      console.log('Users API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures - Kontent.ai might return the array directly
      let users: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        users = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        users = responseData.data;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        users = responseData.items;
      } else if (responseData && responseData.users && Array.isArray(responseData.users)) {
        users = responseData.users;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from users API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed users:', users);
      
      const mappedUsers = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
      }));
      
      console.log('Mapped users:', mappedUsers);
      
      return mappedUsers;
    } catch (error: any) {
      console.error('Error fetching users - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch users: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch users: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    }
  }

  /**
   * Get content items from the environment
   */
  async getContentItems(): Promise<ContentItem[]> {
    try {
      console.log('Making request to content items API...');
      console.log('Management API base URL:', this.managementApi.defaults.baseURL);
      
      const response = await this.managementApi.get<ManagementApiResponse<ContentItem[]>>('/items');
      
      console.log('Content items API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures - Kontent.ai might return the array directly
      let items: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        items = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        items = responseData.data;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        items = responseData.items;
      } else if (responseData && responseData.elements && Array.isArray(responseData.elements)) {
        items = responseData.elements;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from content items API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed items:', items);
      
      const mappedItems = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        codename: item.codename,
        type: item.type,
        lastModified: item.lastModified,
        language: item.language,
        contributors: item.contributors,
      }));
      
      console.log('Mapped content items:', mappedItems);
      
      return mappedItems;
    } catch (error: any) {
      console.error('Error fetching content items - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch content items: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch content items: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch content items: ${error.message}`);
      }
    }
  }

  /**
   * Get content types from the environment
   */
  async getContentTypes(): Promise<ContentType[]> {
    try {
      console.log('Making request to content types API...');
      console.log('Management API base URL:', this.managementApi.defaults.baseURL);
      
      const response = await this.managementApi.get<ManagementApiResponse<ContentType[]>>('/types');
      
      console.log('Content types API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures - Kontent.ai might return the array directly
      let types: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        types = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        types = responseData.data;
      } else if (responseData && responseData.types && Array.isArray(responseData.types)) {
        types = responseData.types;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        types = responseData.items;
      } else if (responseData && responseData.elements && Array.isArray(responseData.elements)) {
        types = responseData.elements;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from content types API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed types:', types);
      
      const mappedTypes = types.map((type: any) => ({
        codename: type.codename,
        name: type.name,
      }));
      
      console.log('Mapped content types:', mappedTypes);
      
      return mappedTypes;
    } catch (error: any) {
      console.error('Error fetching content types - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch content types: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch content types: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch content types: ${error.message}`);
      }
    }
  }

  /**
   * Get available languages for the project
   */
  async getLanguages(): Promise<any[]> {
    try {
      console.log('Making request to languages API...');
      const response = await this.managementApi.get('/languages');
      
      console.log('Languages API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let languages: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        languages = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        languages = responseData.data;
      } else if (responseData && responseData.languages && Array.isArray(responseData.languages)) {
        languages = responseData.languages;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        languages = responseData.items;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from languages API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed languages:', languages);
      return languages;
    } catch (error: any) {
      console.error('Error fetching languages - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch languages: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch languages: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch languages: ${error.message}`);
      }
    }
  }

  /**
   * Get a specific content item with its language variant
   */
  async getContentItem(itemId: string, languageCodename: string): Promise<any> {
    try {
      const response = await this.managementApi.get(
        `/items/${itemId}/variants/${languageCodename}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching content item:', error);
      throw new Error('Failed to fetch content item');
    }
  }

  /**
   * Get content item variants to find available languages
   */
  async getContentItemVariants(itemId: string): Promise<any[]> {
    try {
      console.log(`Getting variants for item ${itemId}...`);
      const response = await this.managementApi.get(`/items/${itemId}/variants`);
      
      console.log('Content item variants response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let variants: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        variants = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        variants = responseData.data;
      } else if (responseData && responseData.variants && Array.isArray(responseData.variants)) {
        variants = responseData.variants;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        variants = responseData.items;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from content item variants API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed variants:', variants);
      return variants;
    } catch (error: any) {
      console.error('Error fetching content item variants - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch content item variants: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch content item variants: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch content item variants: ${error.message}`);
      }
    }
  }

  /**
   * Upsert a language variant with updated contributors
   */
  async upsertLanguageVariant(
    itemId: string, 
    languageCodename: string, 
    variantData: any,
    languageInfo?: any
  ): Promise<void> {
    try {
      console.log(`Upserting variant for item ${itemId} with language: ${languageCodename}`);
      console.log('Variant data to upsert:', JSON.stringify(variantData, null, 2));
      
      // Try using the language codename first
      try {
        await this.managementApi.put(
          `/items/${itemId}/variants/${languageCodename}`,
          variantData
        );
        console.log(`Successfully upserted variant with codename: ${languageCodename}`);
      } catch (error) {
        console.log(`Failed to upsert with codename '${languageCodename}', trying with language ID...`);
        console.log('Original error:', error); if (error && typeof error === 'object' && 'response' in error && error.response) { console.log('API Response Status:', (error as any).response.status); console.log('API Response Data:', (error as any).response.data); }
        
        // If codename fails, try to find the language ID and use that
        try {
          let language;
          if (languageInfo) {
            // Use the language info we already have
            language = languageInfo;
            console.log(`Using provided language info:`, language);
          } else {
            // Fallback to fetching languages if not provided
            const languages = await this.getLanguages();
            language = languages.find(lang => lang.codename === languageCodename);
          }
          
          if (language) {
            console.log(`Found language ID: ${language.id} for codename: ${languageCodename}`);
            console.log(`Attempting PUT to: /items/${itemId}/variants/${language.id}`);
            
            await this.managementApi.put(
              `/items/${itemId}/variants/${language.id}`,
              variantData
            );
            console.log(`Successfully upserted variant with language ID: ${language.id}`);
          } else {
            console.log(`Language not found for codename: ${languageCodename}`);
            throw new Error(`Language not found for codename: ${languageCodename}`);
          }
        } catch (languageError) {
          console.error('Error finding language ID:', languageError);
          console.error('Language error details:', languageError);
          
          // Check if this is a published variant error
          if (error && typeof error === 'object' && 'response' in error && 
              (error as any).response?.status === 400 && 
              (error as any).response?.data?.message?.includes('published and cannot be updated')) {
            throw new Error('Cannot update published content item. Please create a new version first.');
          }
          
          throw error; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error upserting language variant:', error);
      
      // Check if this is a published variant error
      if (error && typeof error === 'object' && 'response' in error && 
          (error as any).response?.status === 400 && 
          (error as any).response?.data?.message?.includes('published and cannot be updated')) {
        throw new Error('Cannot update published content item. Please create a new version first.');
      }
      
      throw new Error('Failed to upsert language variant');
    }
  }



  /**
   * Assign contributors to a content item
   */
  async assignContributors(
    itemId: string,
    languageCodename: string,
    contributorEmails: string[],
    draftStepId?: string
  ): Promise<void> {
    try {
      console.log(`Assigning contributors to item ${itemId} with language: ${languageCodename}`);
      
      // First, try to get the specific language variant
      let currentVariant;
      let actualLanguageId = null;
      let languageInfo = null;
      
      try {
        currentVariant = await this.getContentItem(itemId, languageCodename);
        console.log(`Found variant for language: ${languageCodename}`);
      } catch (error) {
        console.log(`Language variant '${languageCodename}' not found, trying to find available variants...`);
        
        // If the specific language doesn't exist, try to get all variants
        try {
          const variants = await this.getContentItemVariants(itemId);
          console.log('Available variants:', variants);
          
          if (variants.length > 0) {
            // Get the first available variant
            const firstVariant = variants[0];
            const languageId = firstVariant.language?.id;
            
            console.log(`First variant language ID: ${languageId}`);
            
            if (languageId) {
              // Get all languages to find the codename for this ID
              try {
                const languages = await this.getLanguages();
                console.log('Available languages:', languages);
                
                const language = languages.find(lang => lang.id === languageId);
                if (language) {
                  actualLanguageId = language.id;
                  languageInfo = language; // Store the language info
                  console.log(`Found language ID: ${actualLanguageId} for codename: ${languageId}`);
                } else {
                  console.log(`Language with ID ${languageId} not found in languages list, using ID as codename`);
                  actualLanguageId = languageId;
                }
              } catch (languagesError) {
                console.error('Error getting languages:', languagesError);
                console.log(`Using language ID ${languageId} as codename`);
                actualLanguageId = languageId;
              }
            } else {
              console.log('No language ID found in variant, using default');
              actualLanguageId = '00000000-0000-0000-0000-000000000000';
            }
            
            // Use the variant data we already have instead of fetching it again
            console.log(`Using existing variant data with language ID: ${actualLanguageId}`);
            currentVariant = firstVariant;
          } else {
            throw new Error('No language variants found for this content item');
          }
        } catch (variantsError) {
          console.error('Error getting variants:', variantsError);
          throw new Error(`No language variants found for content item ${itemId}`);
        }
      }
      
      console.log('Current variant:', currentVariant);
      
      // Check if the item is published or archived and needs workflow step change
      const currentWorkflowStep = currentVariant.workflow_step;
      const isPublished = currentWorkflowStep?.codename === 'published';
      const isArchived = currentWorkflowStep?.codename === 'archived';
      
      if ((isPublished || isArchived) && draftStepId) {
        console.log(`Item is ${isPublished ? 'published' : 'archived'}, creating new version and setting to draft...`);
        
        try {
          // Create new version and set to draft, and get the new variant data
          const newDraftVariant = await this.createNewVersionAndSetToDraft(
            itemId, 
            actualLanguageId || languageCodename, 
            draftStepId
          );
          console.log('Successfully created new version and set to draft');
          currentVariant = newDraftVariant; // Update currentVariant to the new draft version
          console.log('Updated current variant to new draft version:', currentVariant);
        } catch (workflowError) {
          console.error('Failed to create new version and set to draft:', workflowError);
          throw new Error('Failed to create new version for published/archived content item'); // Re-throw to stop assignment
        }
      }
      
      // Resolve email addresses to user IDs
      const emailToUserIdMap = await this.resolveEmailsToUserIds(contributorEmails);
      const contributorUserIds = contributorEmails.map(email => emailToUserIdMap[email]);
      
      // Prepare the variant data for upsert, including updated contributors
      // Convert elements object to array format that the API expects
      const elementsArray = Object.values(currentVariant.elements || {});
      console.log('Elements array before updating contributors:', elementsArray);
      
      const updatedVariant = {
        ...currentVariant,
        elements: elementsArray,
        // Explicitly set the contributors field with resolved user IDs
        contributors: contributorUserIds.map(userId => ({ id: userId })),
      };

      console.log('Updated variant data for upsert:', updatedVariant);

      // Upsert the updated variant using the actual language ID and language info
      await this.upsertLanguageVariant(itemId, actualLanguageId || languageCodename, updatedVariant, languageInfo);
      console.log(`Successfully assigned contributors using full variant upsert for item ${itemId}`);
    } catch (error) {
      console.error('Error assigning contributors:', error);
      throw new Error('Failed to assign contributors');
    }
  }

  /**
   * Bulk assign contributors to multiple content items
   */
  async bulkAssignContributors(
    assignments: AssignmentRequest[], 
    draftStepId?: string
  ): Promise<any[]> {
    const results = [];
    
    for (const assignment of assignments) {
      try {
        await this.assignContributors(
          assignment.contentItemId,
          assignment.languageCodename,
          assignment.contributors,
          draftStepId
        );
        
        results.push({
          success: true,
          itemId: assignment.contentItemId,
          message: 'Contributors assigned successfully',
        });
      } catch (error) {
        results.push({
          success: false,
          itemId: assignment.contentItemId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  }

  // ===== WORKFLOW MANAGEMENT METHODS =====

  /**
   * Get all workflows for the environment
   */
  async getWorkflows(): Promise<Workflow[]> {
    try {
      console.log('Making request to workflows API...');
      const response = await this.managementApi.get<ManagementApiResponse<Workflow[]>>('/workflows');
      
      console.log('Workflows API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let workflows: any[] = [];
      const responseData = response.data as any;
      
      if (Array.isArray(responseData)) {
        workflows = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        workflows = responseData.data;
      } else if (responseData && responseData.workflows && Array.isArray(responseData.workflows)) {
        workflows = responseData.workflows;
      } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
        workflows = responseData.items;
      } else {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Invalid response format from workflows API. Expected array, got: ${typeof responseData}`);
      }
      
      console.log('Processed workflows:', workflows);
      return workflows;
    } catch (error: any) {
      console.error('Error fetching workflows - Full error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to fetch workflows: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
        throw new Error('Failed to fetch workflows: No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Failed to fetch workflows: ${error.message}`);
      }
    }
  }

  /**
   * Get a specific workflow by ID or codename
   */
  async getWorkflow(workflowIdentifier: string): Promise<Workflow> {
    try {
      console.log(`Getting workflow: ${workflowIdentifier}`);
      const response = await this.managementApi.get<Workflow>(`/workflows/${workflowIdentifier}`);
      
      console.log('Workflow response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching workflow:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Failed to fetch workflow: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Failed to fetch workflow: No response received from server');
      } else {
        throw new Error(`Failed to fetch workflow: ${error.message}`);
      }
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflowData: CreateWorkflowRequest): Promise<Workflow> {
    try {
      console.log('Creating new workflow:', workflowData);
      const response = await this.managementApi.post<Workflow>('/workflows', workflowData);
      
      console.log('Create workflow response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Failed to create workflow: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Failed to create workflow: No response received from server');
      } else {
        throw new Error(`Failed to create workflow: ${error.message}`);
      }
    }
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(workflowIdentifier: string, workflowData: UpdateWorkflowRequest): Promise<Workflow> {
    try {
      console.log(`Updating workflow ${workflowIdentifier}:`, workflowData);
      const response = await this.managementApi.put<Workflow>(`/workflows/${workflowIdentifier}`, workflowData);
      
      console.log('Update workflow response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating workflow:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Failed to update workflow: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Failed to update workflow: No response received from server');
      } else {
        throw new Error(`Failed to update workflow: ${error.message}`);
      }
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowIdentifier: string): Promise<void> {
    try {
      console.log(`Deleting workflow: ${workflowIdentifier}`);
      const response = await this.managementApi.delete(`/workflows/${workflowIdentifier}`);
      
      console.log('Delete workflow response:', response);
      console.log('Response status:', response.status);
      
      if (response.status === 204) {
        console.log('Workflow deleted successfully');
      } else {
        console.log('Unexpected response status for delete:', response.status);
      }
    } catch (error: any) {
      console.error('Error deleting workflow:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Handle specific error cases based on the API documentation
        if (error.response.status === 400) {
          throw new Error('Cannot delete workflow: It is in use or is the default workflow');
        } else if (error.response.status === 404) {
          throw new Error('Workflow not found');
        } else {
          throw new Error(`Failed to delete workflow: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        throw new Error('Failed to delete workflow: No response received from server');
      } else {
        throw new Error(`Failed to delete workflow: ${error.message}`);
      }
    }
  }

  /**
   * Change the workflow step of a content item
   */
  async changeWorkflowStep(
    itemId: string,
    languageCodename: string,
    workflowStepId: string
  ): Promise<void> {
    try {
      console.log(`Changing workflow step for item ${itemId} to step ${workflowStepId}`);
      
      // Try using the language codename first
      try {
        await this.managementApi.put(
          `/items/${itemId}/variants/${languageCodename}/workflow`,
          {
            workflow_step: {
              id: workflowStepId
            }
          }
        );
        console.log(`Successfully changed workflow step with codename: ${languageCodename}`);
      } catch (error) {
        console.log(`Failed to change workflow step with codename '${languageCodename}', trying with language ID...`);
        console.log('Original error:', error);
        
        // If codename fails, try with language ID
        try {
          const languages = await this.getLanguages();
          const language = languages.find(lang => lang.codename === languageCodename);
          
          if (language) {
            console.log(`Found language ID: ${language.id} for codename: ${languageCodename}`);
            console.log(`Attempting PUT to: /items/${itemId}/variants/${language.id}/workflow`);
            
            await this.managementApi.put(
              `/items/${itemId}/variants/${language.id}/workflow`,
              {
                workflow_step: {
                  id: workflowStepId
                }
              }
            );
            console.log(`Successfully changed workflow step with language ID: ${language.id}`);
          } else {
            console.log(`Language not found for codename: ${languageCodename}`);
            throw new Error(`Language not found for codename: ${languageCodename}`);
          }
        } catch (languageError) {
          console.error('Error finding language ID:', languageError);
          console.error('Language error details:', languageError);
          throw error; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error changing workflow step:', error);
      throw new Error('Failed to change workflow step');
    }
  }

  /**
   * Create a new version of a content item and set it to draft workflow step
   * Returns the new variant data for further use
   */
  async createNewVersionAndSetToDraft(
    itemId: string,
    languageCodename: string,
    draftStepId: string
  ): Promise<any> {
    try {
      console.log(`Creating new version for item ${itemId} and setting to draft step ${draftStepId}`);
      
      // First, create a new version
      try {
        await this.managementApi.post(
          `/items/${itemId}/variants/${languageCodename}/new-version`
        );
        console.log('New version created successfully');
      } catch (error) {
        console.log(`Failed to create new version with codename '${languageCodename}', trying with language ID...`);
        
        // If codename fails, try with language ID
        const languages = await this.getLanguages();
        const language = languages.find(lang => lang.codename === languageCodename);
        
        if (language) {
          await this.managementApi.post(
            `/items/${itemId}/variants/${language.id}/new-version`
          );
          console.log('New version created successfully with language ID');
        } else {
          throw new Error(`Language not found for codename: ${languageCodename}`);
        }
      }
      
      // Then change the workflow step to draft
      await this.changeWorkflowStep(itemId, languageCodename, draftStepId);
      console.log('Workflow step changed to draft successfully');
      
      // Get the updated variant data to return
      const newVariant = await this.getContentItem(itemId, languageCodename);
      console.log('Retrieved new variant data after workflow change:', newVariant);
      
      return newVariant;
      
    } catch (error) {
      console.error('Error creating new version and setting to draft:', error);
      throw new Error('Failed to create new version and set to draft');
    }
  }

  /**
   * Resolve email addresses to Kontent.ai user IDs
   */
  async resolveEmailsToUserIds(emails: string[]): Promise<{ [email: string]: string }> {
    try {
      console.log('Resolving emails to user IDs:', emails);
      
      // Get all users from Kontent.ai
      const users = await this.getUsers();
      console.log('Retrieved users:', users);
      
      const emailToUserIdMap: { [email: string]: string } = {};
      
      for (const email of emails) {
        const user = users.find(u => u.email === email);
        if (user) {
          emailToUserIdMap[email] = user.id;
          console.log(`Resolved email ${email} to user ID: ${user.id}`);
        } else {
          console.warn(`User not found for email: ${email}`);
          // For now, we'll use the email as the ID, but this might cause issues
          // In a production environment, you might want to throw an error or handle this differently
          emailToUserIdMap[email] = email;
        }
      }
      
      console.log('Email to user ID mapping:', emailToUserIdMap);
      return emailToUserIdMap;
      
    } catch (error) {
      console.error('Error resolving emails to user IDs:', error);
      throw new Error('Failed to resolve emails to user IDs');
    }
  }

  /**
   * Get the default workflow and find the draft step ID
   */
  async getDefaultWorkflowDraftStep(): Promise<string | null> {
    try {
      console.log('Getting default workflow to find draft step...');
      
      // Get all workflows
      const workflows = await this.getWorkflows();
      
      // Find the default workflow (usually the first one or one with specific characteristics)
      // You might need to adjust this logic based on your specific workflow setup
      const defaultWorkflow = workflows.find(workflow => 
        workflow.codename === 'default' || 
        workflow.name.toLowerCase().includes('default') ||
        workflow.id === '00000000-0000-0000-0000-000000000000'
      ) || workflows[0];
      
      if (!defaultWorkflow) {
        console.log('No default workflow found');
        return null;
      }
      
      console.log('Found default workflow:', defaultWorkflow.name);
      
      // Find the draft step (usually the first step that's not published, scheduled, or archived)
      const draftStep = defaultWorkflow.steps.find(step => 
        step.codename !== 'published' && 
        step.codename !== 'scheduled' && 
        step.codename !== 'archived' &&
        !step.codename.includes('published') &&
        !step.codename.includes('scheduled') &&
        !step.codename.includes('archived')
      );
      
      if (draftStep) {
        console.log(`Found draft step: ${draftStep.name} (${draftStep.id})`);
        return draftStep.id;
      } else {
        console.log('No draft step found in default workflow');
        return null;
      }
      
    } catch (error) {
      console.error('Error getting default workflow draft step:', error);
      return null;
    }
  }

  /**
   * Assign contributors with automatic workflow step management
   * This method automatically handles changing workflow steps for published/archived items
   */
  async assignContributorsWithWorkflowManagement(
    itemId: string,
    languageCodename: string,
    contributorEmails: string[]
  ): Promise<void> {
    try {
      console.log(`Assigning contributors with workflow management for item ${itemId}`);
      
      // Get the draft step ID from the default workflow
      const draftStepId = await this.getDefaultWorkflowDraftStep();
      
      if (draftStepId) {
        console.log(`Using draft step ID: ${draftStepId}`);
        await this.assignContributors(itemId, languageCodename, contributorEmails, draftStepId);
      } else {
        console.log('No draft step found, assigning contributors without workflow change');
        await this.assignContributors(itemId, languageCodename, contributorEmails);
      }
      
      console.log('Contributors assigned with workflow management successfully');
    } catch (error) {
      console.error('Error assigning contributors with workflow management:', error);
      throw new Error('Failed to assign contributors with workflow management');
    }
  }

  /**
   * Bulk assign contributors with automatic workflow step management
   * This method automatically handles changing workflow steps for published/archived items
   */
  async bulkAssignContributorsWithWorkflowManagement(
    assignments: AssignmentRequest[]
  ): Promise<any[]> {
    try {
      console.log('Bulk assigning contributors with workflow management...');
      
      // Get the draft step ID from the default workflow
      const draftStepId = await this.getDefaultWorkflowDraftStep();
      
      if (draftStepId) {
        console.log(`Using draft step ID: ${draftStepId}`);
        return await this.bulkAssignContributors(assignments, draftStepId);
      } else {
        console.log('No draft step found, bulk assigning contributors without workflow change');
        return await this.bulkAssignContributors(assignments);
      }
    } catch (error) {
      console.error('Error in bulk assignment with workflow management:', error);
      throw new Error('Failed to bulk assign contributors with workflow management');
    }
  }
} 
