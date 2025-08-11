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
  async getContentItem(itemId: string, languageIdentifier: string): Promise<any> {
    try {
      console.log(`Fetching content item ${itemId} with language identifier: ${languageIdentifier}`);
      const response = await this.managementApi.get(
        `/items/${itemId}/variants/${languageIdentifier}`
      );
      console.log(`Successfully fetched content item with identifier: ${languageIdentifier}`);
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
    languageIdentifier: string, 
    variantData: any,
    languageInfo?: any
  ): Promise<void> {
    try {
      console.log(`Upserting variant for item ${itemId} with language identifier: ${languageIdentifier}`);
      console.log('Variant data to upsert:', JSON.stringify(variantData, null, 2));
      
      // Check if the language identifier is a GUID (language ID) or a codename
      const isLanguageId = languageIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      if (isLanguageId) {
        // It's a language ID, use it directly
        console.log(`Language identifier '${languageIdentifier}' is a language ID, using directly`);
        try {
          await this.managementApi.put(
            `/items/${itemId}/variants/${languageIdentifier}`,
            variantData
          );
          console.log(`Successfully upserted variant with language ID: ${languageIdentifier}`);
          return;
        } catch (error) {
          console.error(`Failed to upsert with language ID '${languageIdentifier}':`, error);
          throw error;
        }
      } else {
        // It's a language codename, try using it first, then fall back to ID
        console.log(`Language identifier '${languageIdentifier}' appears to be a codename`);
        
        try {
          // Try using the language codename first
          await this.managementApi.put(
            `/items/${itemId}/variants/${languageIdentifier}`,
            variantData
          );
          console.log(`Successfully upserted variant with codename: ${languageIdentifier}`);
        } catch (error) {
          console.log(`Failed to upsert with codename '${languageIdentifier}', trying with language ID...`);
          console.log('Original error:', error); 
          if (error && typeof error === 'object' && 'response' in error && error.response) { 
            console.log('API Response Status:', (error as any).response.status); 
            console.log('API Response Data:', (error as any).response.data); 
          }
          
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
              language = languages.find(lang => lang.codename === languageIdentifier);
            }
            
            if (language) {
              console.log(`Found language ID: ${language.id} for codename: ${languageIdentifier}`);
              console.log(`Attempting PUT to: /items/${itemId}/variants/${language.id}`);
              
              await this.managementApi.put(
                `/items/${itemId}/variants/${language.id}`,
                variantData
              );
              console.log(`Successfully upserted variant with language ID: ${language.id}`);
            } else {
              console.log(`Language not found for codename: ${languageIdentifier}`);
              throw new Error(`Language not found for codename: ${languageIdentifier}`);
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
      }
    } catch (error) {
      console.error('Error upserting language variant:', error);
      
      // Check if this is a published variant error
      if (error && typeof error === 'object' && 'response' in error && 
          (error as any).response?.status === 400) {
        const errorMessage = (error as any).response?.data?.message || '';
        if (errorMessage.includes('published and cannot be updated') || 
            errorMessage.includes('cannot be updated') ||
            errorMessage.includes('workflow step')) {
          throw new Error(`Cannot update content item: ${errorMessage}`);
        }
      }
      
      // Re-throw the original error with more context
      if (error instanceof Error) {
        throw new Error(`Failed to upsert language variant: ${error.message}`);
      } else {
        throw new Error('Failed to upsert language variant');
      }
    }
  }



  /**
   * Assign contributors to a content item
   */
  async assignContributors(
    itemId: string,
    languageIdentifier: string,
    contributorEmails: string[],
    draftStepId?: string
  ): Promise<void> {
    try {
      console.log(`Assigning contributors to item ${itemId} with language: ${languageIdentifier}`);
      
      // First, resolve the language identifier to get the actual language ID and info
      let actualLanguageId = null;
      let languageInfo = null;
      
      try {
        // If we have a language codename, resolve it to an ID
        if (!languageIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.log(`Language identifier '${languageIdentifier}' appears to be a codename, resolving to ID...`);
          const languages = await this.getLanguages();
          const language = languages.find(lang => lang.codename === languageIdentifier);
          if (language) {
            actualLanguageId = language.id;
            languageInfo = language;
            console.log(`Resolved language codename '${languageIdentifier}' to ID: ${actualLanguageId}`);
          } else {
            throw new Error(`Language with codename '${languageIdentifier}' not found`);
          }
        } else {
          // It's already a language ID
          actualLanguageId = languageIdentifier;
          console.log(`Language identifier '${languageIdentifier}' is already an ID`);
        }
      } catch (error) {
        console.error('Error resolving language identifier:', error);
        throw new Error(`Could not resolve language identifier '${languageIdentifier}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Now try to get the specific language variant using the resolved ID
      let currentVariant;
      try {
        currentVariant = await this.getContentItem(itemId, actualLanguageId);
        console.log(`Found variant for language ID: ${actualLanguageId}`);
      } catch (error) {
        console.log(`Language variant with ID '${actualLanguageId}' not found, trying to find available variants...`);
        
        // If the specific language doesn't exist, try to get all variants
        try {
          const variants = await this.getContentItemVariants(itemId);
          console.log('Available variants:', variants);
          
          if (variants.length > 0) {
            // Get the first available variant
            const firstVariant = variants[0];
            const variantLanguageId = firstVariant.language?.id;
            
            console.log(`First variant language ID from API: ${variantLanguageId}`);
            
            // Get all languages to find the actual language ID
            try {
              const languages = await this.getLanguages();
              console.log('Available languages:', languages);
              
              // The variant language ID is the actual language ID from Kontent.ai
              if (variantLanguageId) {
                // Verify this language ID exists in our languages list
                let language = languages.find(lang => lang.id === variantLanguageId);
                
                if (language) {
                  actualLanguageId = language.id;
                  languageInfo = language;
                  console.log(`Using variant language: ${language.codename} -> ${language.id}`);
                } else {
                  console.log(`Language with ID ${variantLanguageId} not found in languages list, finding default...`);
                  // Fall back to finding a default language
                  const defaultLanguage = languages.find(lang => lang.codename === 'default' || lang.codename === 'en-us' || lang.codename === 'en');
                  if (defaultLanguage) {
                    actualLanguageId = defaultLanguage.id;
                    languageInfo = defaultLanguage;
                    console.log(`Using default language: ${defaultLanguage.codename} -> ${defaultLanguage.id}`);
                  } else if (languages.length > 0) {
                    actualLanguageId = languages[0].id;
                    languageInfo = languages[0];
                    console.log(`Using first available language: ${languages[0].codename} -> ${languages[0].id}`);
                  } else {
                    throw new Error('No languages available in the project');
                  }
                }
              } else {
                console.log('No language ID found in variant, finding default language...');
                // Try to find a default language
                const defaultLanguage = languages.find(lang => lang.codename === 'default' || lang.codename === 'en-us' || lang.codename === 'en');
                if (defaultLanguage) {
                  actualLanguageId = defaultLanguage.id;
                  languageInfo = defaultLanguage;
                  console.log(`Found default language: ${defaultLanguage.codename} -> ${defaultLanguage.id}`);
                } else if (languages.length > 0) {
                  // If no default language found, use the first available language
                  const firstLanguage = languages[0];
                  actualLanguageId = firstLanguage.id;
                  languageInfo = firstLanguage;
                  console.log(`Using first available language: ${firstLanguage.codename} -> ${firstLanguage.id}`);
                } else {
                  throw new Error('No languages available in the project');
                }
              }
            } catch (languagesError) {
              console.error('Error getting languages:', languagesError);
              throw new Error('Could not determine language for content item variant');
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
      console.log('Current workflow step before check:', currentWorkflowStep);
      
      // Get the default workflow to find published and archived step IDs
      let isPublished = false;
      let isArchived = false;
      
      if (draftStepId) {
        try {
          const workflows = await this.getWorkflows();
          const defaultWorkflow = workflows.find(w => w.codename === 'default');
          
          if (defaultWorkflow) {
            const publishedStepId = defaultWorkflow.published_step?.id;
            const archivedStepId = defaultWorkflow.archived_step?.id;
            
            isPublished = publishedStepId ? currentWorkflowStep?.id === publishedStepId : false;
            isArchived = archivedStepId ? currentWorkflowStep?.id === archivedStepId : false;
            
            console.log('Published step ID:', publishedStepId);
            console.log('Archived step ID:', archivedStepId);
            console.log('Is published:', isPublished, 'Is archived:', isArchived);
          }
        } catch (workflowError) {
          console.warn('Could not determine workflow status, proceeding with current variant:', workflowError);
        }
      }
      
      if ((isPublished || isArchived) && draftStepId) {
        console.log(`Item is ${isPublished ? 'published' : 'archived'}, changing workflow step to draft first...`);
        
        try {
          // For published/archived items, we need to change the workflow step first using the workflow API
          // This will put the item in a draft state where we can then update contributors
          console.log(`Changing workflow step to draft step: ${draftStepId}`);
          
          // Use the workflow API to change the step first
          await this.changeWorkflowStep(itemId, actualLanguageId, draftStepId);
          console.log(`Successfully changed workflow step to draft for item ${itemId}`);
          
          // Now fetch the updated variant to get the current state
          currentVariant = await this.getContentItem(itemId, actualLanguageId);
          console.log('Retrieved updated variant after workflow step change:', currentVariant);
          
        } catch (workflowError) {
          console.error('Failed to change workflow step to draft:', workflowError);
          throw new Error('Failed to change workflow step for published/archived content item');
        }
      }
      
      // Resolve email addresses to user IDs
      const emailToUserIdMap = await this.resolveEmailsToUserIds(contributorEmails);
      const contributorUserIds = contributorEmails.map(email => emailToUserIdMap[email]);
      
      // Prepare the variant data for upsert, including updated contributors
      // Convert elements object to array format that the API expects
      const elementsArray = Object.values(currentVariant.elements || {});
      console.log('Elements array before updating contributors:', elementsArray);
      
      // Ensure we have the correct workflow step information
      const updatedVariant = {
        ...currentVariant,
        elements: elementsArray,
        // Explicitly set the contributors field with resolved user IDs
        contributors: contributorUserIds.map(userId => ({ id: userId })),
        // Ensure workflow step is correctly set for the new draft version
        workflow_step: currentVariant.workflow_step,
        workflow: currentVariant.workflow,
      };

      console.log('Updated variant data for upsert:', updatedVariant);
      console.log('Final workflow step in updated variant:', updatedVariant.workflow_step);
      console.log('Final workflow in updated variant:', updatedVariant.workflow);

      // Upsert the updated variant using the actual language ID and language info
      await this.upsertLanguageVariant(itemId, actualLanguageId, updatedVariant, languageInfo);
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
    languageIdentifier: string,
    workflowStepId: string
  ): Promise<void> {
    try {
      console.log(`Changing workflow step for item ${itemId} to step ${workflowStepId}`);
      console.log(`Using language identifier: ${languageIdentifier}`);

      // For published/archived items, we need to create a new version
      // For draft items, we can update the variant directly
      
      try {
        // First, get the current variant to see its current state
        const currentVariant = await this.getContentItem(itemId, languageIdentifier);
        console.log('Current variant before workflow change:', currentVariant);
        
        // Check if the item is published or archived
        const currentWorkflowStep = currentVariant.workflow_step;
        const isPublished = currentWorkflowStep?.id === 'c199950d-99f0-4983-b711-6c4c91624b22'; // Published step ID
        const isArchived = currentWorkflowStep?.id === '7a535a69-ad34-47f8-806a-def1fdf4d391'; // Archived step ID
        
        if (isPublished || isArchived) {
          console.log(`Item is ${isPublished ? 'published' : 'archived'}, using fallback approach...`);
          
          // For published/archived items, we'll use a fallback approach since the new-version endpoint
          // seems to be unreliable. We'll try to create a new version by copying and updating.
          try {
            console.log(`Creating new version for ${isPublished ? 'published' : 'archived'} item using fallback method...`);
            
            // Create new version data with updated workflow step
            const newVersionData = {
              ...currentVariant,
              workflow_step: {
                id: workflowStepId
              },
              workflow: {
                workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
                step_identifier: { id: workflowStepId }
              }
            };
            
            // Remove fields that shouldn't be copied to new version
            delete newVersionData.id;
            delete newVersionData.last_modified;
            delete newVersionData.version;
            
            console.log('New version data for fallback method:', newVersionData);
            
            // Use the existing upsertLanguageVariant method to create the new version
            await this.upsertLanguageVariant(itemId, languageIdentifier, newVersionData, currentVariant.language);
            console.log(`Successfully created new version with workflow step ${workflowStepId} for item ${itemId} (fallback method)`);
            
          } catch (fallbackError) {
            console.error('Failed to create new version using fallback method:', fallbackError);
            
            // If even the fallback fails, try to unpublish first
            if (isPublished) {
              console.log('Trying to unpublish item first...');
              try {
                await this.managementApi.put(
                  `/items/${itemId}/variants/${languageIdentifier}/unpublish`
                );
                console.log(`Successfully unpublished item ${itemId}`);
                
                // Now try to update the workflow step
                const updatedVariantData = {
                  ...currentVariant,
                  workflow_step: {
                    id: workflowStepId
                  },
                  workflow: {
                    workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
                    step_identifier: { id: workflowStepId }
                  }
                };
                
                delete updatedVariantData.id;
                delete updatedVariantData.last_modified;
                delete updatedVariantData.version;
                
                await this.upsertLanguageVariant(itemId, languageIdentifier, updatedVariantData, currentVariant.language);
                console.log(`Successfully updated workflow step to ${workflowStepId} for item ${itemId} after unpublishing`);
                
                             } catch (unpublishError) {
                 console.error('Failed to unpublish item:', unpublishError);
                 const errorMessage = unpublishError instanceof Error ? unpublishError.message : String(unpublishError);
                 throw new Error(`Cannot modify published/archived content item. Failed to unpublish: ${errorMessage}`);
               }
             } else {
               const errorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
               throw new Error(`Cannot modify archived content item: ${errorMessage}`);
             }
          }
        } else {
          // For draft items, we can update the variant directly
          console.log('Item is in draft state, updating variant directly...');
          
          // Create updated variant data with the new workflow step
          const updatedVariantData = {
            ...currentVariant,
            workflow_step: {
              id: workflowStepId
            },
            workflow: {
              workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
              step_identifier: { id: workflowStepId }
            }
          };
          
          console.log('Updated variant data for workflow change:', updatedVariantData);
          
          // Update the variant with the new workflow step
          await this.upsertLanguageVariant(itemId, languageIdentifier, updatedVariantData, currentVariant.language);
          console.log(`Successfully changed workflow step to ${workflowStepId} for item ${itemId}`);
        }
        
      } catch (error) {
        console.log(`Failed to change workflow step with identifier '${languageIdentifier}', trying to resolve language...`);
        console.log('Original error:', error);
        
        // If the identifier fails, try to resolve it
        try {
          const languages = await this.getLanguages();
          
          // Check if the identifier is already a language ID
          let language = languages.find(lang => lang.id === languageIdentifier);
          
          // If not found by ID, try to find by codename
          if (!language) {
            language = languages.find(lang => lang.codename === languageIdentifier);
          }
          
          // If still not found, try common default language names
          if (!language) {
            language = languages.find(lang => 
              lang.codename === 'default' || 
              lang.codename === 'en-us' || 
              lang.codename === 'en'
            );
          }
          
          // If still not found, use the first available language
          if (!language && languages.length > 0) {
            language = languages[0];
          }
          
          if (language) {
            console.log(`Found language: ${language.codename} -> ${language.id}`);
            
            // Get the current variant with the resolved language ID
            const currentVariant = await this.getContentItem(itemId, language.id);
            console.log('Current variant before workflow change (resolved language):', currentVariant);
            
            // Check workflow state again with resolved language
            const currentWorkflowStep = currentVariant.workflow_step;
            const isPublished = currentWorkflowStep?.id === 'c199950d-99f0-4983-b711-6c4c91624b22';
            const isArchived = currentWorkflowStep?.id === '7a535a69-ad34-47f8-806a-def1fdf4d391';
            
            if (isPublished || isArchived) {
              console.log(`Item is ${isPublished ? 'published' : 'archived'} with resolved language, using fallback approach...`);
              
              try {
                console.log(`Creating new version for ${isPublished ? 'published' : 'archived'} item using fallback method (resolved language)...`);
                
                // Create new version data with updated workflow step
                const newVersionData = {
                  ...currentVariant,
                  workflow_step: {
                    id: workflowStepId
                  },
                  workflow: {
                    workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
                    step_identifier: { id: workflowStepId }
                  }
                };
                
                // Remove fields that shouldn't be copied to new version
                delete newVersionData.id;
                delete newVersionData.last_modified;
                delete newVersionData.version;
                
                console.log('New version data for fallback method (resolved language):', newVersionData);
                
                // Use the existing upsertLanguageVariant method to create the new version
                await this.upsertLanguageVariant(itemId, language.id, newVersionData, currentVariant.language);
                console.log(`Successfully created new version with workflow step ${workflowStepId} for item ${itemId} with resolved language ID: ${language.id} (fallback method)`);
                
              } catch (fallbackError) {
                console.error('Failed to create new version using fallback method (resolved language):', fallbackError);
                
                // If even the fallback fails, try to unpublish first
                if (isPublished) {
                  console.log('Trying to unpublish item first (resolved language)...');
                  try {
                    await this.managementApi.put(
                      `/items/${itemId}/variants/${language.id}/unpublish`
                    );
                    console.log(`Successfully unpublished item ${itemId} with resolved language ID: ${language.id}`);
                    
                    // Now try to update the workflow step
                    const updatedVariantData = {
                      ...currentVariant,
                      workflow_step: {
                        id: workflowStepId
                      },
                      workflow: {
                        workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
                        step_identifier: { id: workflowStepId }
                      }
                    };
                    
                    delete updatedVariantData.id;
                    delete updatedVariantData.last_modified;
                    delete updatedVariantData.version;
                    
                    await this.upsertLanguageVariant(itemId, language.id, updatedVariantData, currentVariant.language);
                    console.log(`Successfully updated workflow step to ${workflowStepId} for item ${itemId} with resolved language ID: ${language.id} after unpublishing`);
                    
                  } catch (unpublishError) {
                    console.error('Failed to unpublish item (resolved language):', unpublishError);
                    const errorMessage = unpublishError instanceof Error ? unpublishError.message : String(unpublishError);
                    throw new Error(`Cannot modify published/archived content item. Failed to unpublish: ${errorMessage}`);
                  }
                } else {
                  const errorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                  throw new Error(`Cannot modify archived content item: ${errorMessage}`);
                }
              }
            } else {
              // For draft items, update variant directly
              const updatedVariantData = {
                ...currentVariant,
                workflow_step: {
                  id: workflowStepId
                },
                workflow: {
                  workflow_identifier: currentVariant.workflow?.workflow_identifier || { id: '00000000-0000-0000-0000-000000000000' },
                  step_identifier: { id: workflowStepId }
                }
              };
              
              console.log('Updated variant data for workflow change (resolved language):', updatedVariantData);
              
              await this.upsertLanguageVariant(itemId, language.id, updatedVariantData, currentVariant.language);
              console.log(`Successfully changed workflow step to ${workflowStepId} for item ${itemId} with resolved language ID: ${language.id}`);
            }
          } else {
            console.log(`No suitable language found for identifier: ${languageIdentifier}`);
            throw new Error(`No suitable language found for identifier: ${languageIdentifier}`);
          }
        } catch (languageError) {
          console.error('Error resolving language identifier:', languageError);
          console.error('Language error details:', languageError);
          throw error; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error changing workflow step:', error);
      
      // Provide more specific error information
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        console.error('Response status:', response.status);
        console.error('Response data:', response.data);
        throw new Error(`Failed to change workflow step: ${response.status} - ${response.data?.message || 'Unknown error'}`);
      }
      
      throw new Error('Failed to change workflow step');
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
