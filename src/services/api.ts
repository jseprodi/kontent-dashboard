import axios, { AxiosInstance } from 'axios';
import {
  User,
  ContentItem,
  ContentType,
  AssignmentRequest,
  SubscriptionApiResponse,
  ManagementApiResponse
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
      console.log('Variant data to upsert:', variantData);
      
      // Try using the language codename first
      try {
        await this.managementApi.put(
          `/items/${itemId}/variants/${languageCodename}`,
          variantData
        );
        console.log(`Successfully upserted variant with codename: ${languageCodename}`);
      } catch (error) {
        console.log(`Failed to upsert with codename '${languageCodename}', trying with language ID...`);
        console.log('Original error:', error);
        
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
          throw error; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error upserting language variant:', error);
      throw new Error('Failed to upsert language variant');
    }
  }

  /**
   * Assign contributors to a content item
   */
  async assignContributors(
    itemId: string,
    languageCodename: string,
    contributorEmails: string[]
  ): Promise<void> {
    try {
      console.log(`Assigning contributors to item ${itemId} with language: ${languageCodename}`);
      
      // First, try to get the specific language variant
      let currentVariant;
      let actualLanguageCodename = languageCodename;
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
                  actualLanguageCodename = language.codename;
                  languageInfo = language; // Store the language info
                  console.log(`Found language codename: ${actualLanguageCodename} for ID: ${languageId}`);
                } else {
                  console.log(`Language with ID ${languageId} not found in languages list, using ID as codename`);
                  actualLanguageCodename = languageId;
                }
              } catch (languagesError) {
                console.error('Error getting languages:', languagesError);
                console.log(`Using language ID ${languageId} as codename`);
                actualLanguageCodename = languageId;
              }
            } else {
              console.log('No language ID found in variant, using default');
              actualLanguageCodename = 'default';
            }
            
            // Use the variant data we already have instead of fetching it again
            console.log(`Using existing variant data with language: ${actualLanguageCodename}`);
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
      
      // Update the contributors field
      const updatedVariant = {
        ...currentVariant,
        elements: {
          ...currentVariant.elements,
          contributors: {
            value: contributorEmails,
          },
        },
      };

      console.log('Updated variant:', updatedVariant);

      // Upsert the updated variant using the actual language codename and language info
      await this.upsertLanguageVariant(itemId, actualLanguageCodename, updatedVariant, languageInfo);
      console.log(`Successfully assigned contributors to item ${itemId} with language: ${actualLanguageCodename}`);
    } catch (error) {
      console.error('Error assigning contributors:', error);
      throw new Error('Failed to assign contributors');
    }
  }

  /**
   * Bulk assign contributors to multiple content items
   */
  async bulkAssignContributors(assignments: AssignmentRequest[]): Promise<any[]> {
    const results = [];
    
    for (const assignment of assignments) {
      try {
        await this.assignContributors(
          assignment.contentItemId,
          assignment.languageCodename,
          assignment.contributors
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
} 