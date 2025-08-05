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
   * Upsert a language variant with updated contributors
   */
  async upsertLanguageVariant(
    itemId: string, 
    languageCodename: string, 
    variantData: any
  ): Promise<void> {
    try {
      await this.managementApi.put(
        `/items/${itemId}/variants/${languageCodename}`,
        variantData
      );
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
      // First, get the current variant
      const currentVariant = await this.getContentItem(itemId, languageCodename);
      
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

      // Upsert the updated variant
      await this.upsertLanguageVariant(itemId, languageCodename, updatedVariant);
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