import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  ContentItem, 
  ContentType, 
  AssignmentRequest, 
  SubscriptionApiResponse, 
  ManagementApiResponse 
} from '../types';

/**
 * API service for Kontent.ai Subscription API and Management API
 */
export class ApiService {
  private subscriptionApi: AxiosInstance;
  private managementApi: AxiosInstance;

  constructor(
    subscriptionApiKey: string,
    managementApiKey: string,
    environmentId: string,
    subscriptionId: string
  ) {
    // Initialize Subscription API client
    this.subscriptionApi = axios.create({
      baseURL: `https://manage.kontent.ai/v2/subscriptions/${subscriptionId}`,
      headers: {
        'Authorization': `Bearer ${subscriptionApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Initialize Management API client
    this.managementApi = axios.create({
      baseURL: `https://manage.kontent.ai/v2/projects/${environmentId}`,
      headers: {
        'Authorization': `Bearer ${managementApiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get all users from the subscription
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.subscriptionApi.get<SubscriptionApiResponse<User[]>>('/users');
      return response.data.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get content items from the environment
   */
  async getContentItems(): Promise<ContentItem[]> {
    try {
      const response = await this.managementApi.get<ManagementApiResponse<ContentItem[]>>('/items');
      return response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        codename: item.codename,
        type: item.type,
        lastModified: item.lastModified,
        language: item.language,
        contributors: item.contributors,
      }));
    } catch (error) {
      console.error('Error fetching content items:', error);
      throw new Error('Failed to fetch content items');
    }
  }

  /**
   * Get content types from the environment
   */
  async getContentTypes(): Promise<ContentType[]> {
    try {
      const response = await this.managementApi.get<ManagementApiResponse<ContentType[]>>('/types');
      return response.data.data.map((type: any) => ({
        codename: type.codename,
        name: type.name,
      }));
    } catch (error) {
      console.error('Error fetching content types:', error);
      throw new Error('Failed to fetch content types');
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
          contentItemId: assignment.contentItemId,
          success: true,
        });
      } catch (error) {
        results.push({
          contentItemId: assignment.contentItemId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  }
} 