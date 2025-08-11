/**
 * Type definitions for the Kontent.ai Custom App
 */

export interface CustomAppContext {
  config: Record<string, any>;
  context: {
    environmentId: string;
    userId: string;
    userEmail: string;
    userRoles: Array<{
      id: string;
      codename?: string;
    }>;
  };
}

export interface CustomAppState {
  isLoading: boolean;
  error: string | null;
  context: CustomAppContext | null;
}

// Legacy types for backward compatibility with existing hooks
export interface AppContext {
  environmentId: string;
  userId: string;
  userEmail: string;
  userRoles: Array<{
    id: string;
    codename?: string;
  }>;
}

export interface AppConfig {
  [key: string]: unknown;
}

export interface UserRole {
  readonly id: string;
  readonly codename?: string | null;
}

// Types for the bulk contributor assignment app
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface ContentItem {
  id: string;
  name: string;
  codename: string;
  type: {
    codename: string;
  };
  lastModified?: string;
  language?: {
    codename: string;
  };
  contributors?: string[];
  workflow_step?: {
    id: string;
    codename: string;
    name: string;
  };
}

export interface ContentType {
  codename: string;
  name: string;
}

export interface AssignmentRequest {
  contentItemId: string;
  languageCodename: string;
  contributors: string[];
}

export interface AssignmentResult {
  contentItemId: string;
  success: boolean;
  error?: string;
}

export interface BulkAssignmentState {
  selectedContentItems: ContentItem[];
  selectedContributors: User[];
  isAssigning: boolean;
  assignmentResults: AssignmentResult[];
}

export interface SubscriptionApiResponse<T> {
  data: T;
  pagination?: {
    continuation_token?: string;
  };
}

export interface ManagementApiResponse<T> {
  data: T;
}

// Workflow-related types based on Kontent.ai Management API v2
export interface WorkflowStep {
  id: string;
  name: string;
  codename: string;
  color?: string;
  role_ids?: string[];
  unpublish_role_ids?: string[];
  create_new_version_role_ids?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  codename: string;
  scopes: string[];
  steps: WorkflowStep[];
  published_step?: WorkflowStep;
  scheduled_step?: WorkflowStep;
  archived_step?: WorkflowStep;
}

export interface CreateWorkflowRequest {
  name: string;
  codename: string;
  scopes: string[];
  steps: WorkflowStep[];
  published_step?: WorkflowStep;
  scheduled_step?: WorkflowStep;
  archived_step?: WorkflowStep;
}

export interface UpdateWorkflowRequest extends Partial<CreateWorkflowRequest> {
  // All fields are optional for updates
}



