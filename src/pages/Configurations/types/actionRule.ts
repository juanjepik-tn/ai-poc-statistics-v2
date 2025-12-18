// Backend contract types
export type ActionRuleAction = 'transfer' | 'collect';
export type ActionRuleState = 'disabled' | 'enabled' | 'to_review';

// Backend trigger type
export interface ActionRuleTrigger {
  id?: number;
  action_rule_id?: number;
  content: string;
}

// Backend response type
export interface ActionRuleBackend {
  id: number;
  store_id?: number;
  name: string;
  action: ActionRuleAction;
  state: ActionRuleState;
  instruction?: string | null;
  triggers: ActionRuleTrigger[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Frontend type (maintains compatibility with existing components)
export interface ActionRule {
  // TODO: id is optional temporarily to support mock data during development.
  // Once the backend is fully integrated, change to `id: number` (required).
  id?: number;
  name: string;
  action: ActionRuleAction;
  state: ActionRuleState;
  instruction?: string | null;
  trigger: string; 
}

// Backend response
export interface ActionRulesBackendResponse {
  data: ActionRuleBackend[];
  total: number;
  limit: number;
  offset: number;
}

// Frontend response (para mantener compatibilidad)
export interface ActionRulesResponse {
  items: ActionRule[];
  total: number;
  limit: number;
  offset: number;
}

// Form data for create/update
export interface ActionRuleFormData {
  name: string;
  action: ActionRuleAction;
  state: ActionRuleState;
  instruction: string | null;
  trigger: string;
}

// Utility function to map backend to frontend format
export const mapBackendToFrontend = (backend: ActionRuleBackend): ActionRule => ({
  id: backend.id,
  name: backend.name,
  action: backend.action,
  state: backend.state,
  instruction: backend.instruction,
  trigger: backend.triggers?.[0]?.content ?? '',
});

// Utility function to map frontend to backend format
export const mapFrontendToBackend = (frontend: ActionRuleFormData): {
  name: string;
  action: ActionRuleAction;
  state: ActionRuleState;
  instruction: string | null;
  triggers: { content: string }[];
} => ({
  name: frontend.name,
  action: frontend.action,
  state: frontend.state,
  instruction: frontend.instruction,
  triggers: [{ content: frontend.trigger }],
});

// Suggestion type for frontend mock suggestions
export interface ActionRuleSuggestion {
  id: string;
  name: string;
  description: string;
  defaultTrigger: string;
}
