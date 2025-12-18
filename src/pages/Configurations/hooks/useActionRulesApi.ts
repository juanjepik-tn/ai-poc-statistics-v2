import { useState, useCallback, useEffect } from 'react';
import { 
  ActionRule, 
  ActionRuleFormData, 
  ActionRulesResponse,
  ActionRulesBackendResponse,
  ActionRuleBackend,
  mapBackendToFrontend,
  mapFrontendToBackend,
} from '../types/actionRule';
import { useFetch } from '@/hooks';
import { API_ENDPOINTS } from '@/app/Axios/Axios';

interface UseActionRulesApiResult {
  actionRules: ActionRule[];
  loading: boolean;
  error: string | null;
  fetchActionRules: () => Promise<ActionRulesResponse>;
  createActionRule: (data: ActionRuleFormData) => Promise<ActionRule>;
  updateActionRule: (id: number, data: ActionRuleFormData) => Promise<ActionRule>;
  deleteActionRule: (id: number) => Promise<void>;
  toggleActionRule: (id: number) => Promise<ActionRule>;
}

const useActionRulesApi = (): UseActionRulesApiResult => {
  const [actionRules, setActionRules] = useState<ActionRule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { request } = useFetch();

  // Fetch action rules on mount
  useEffect(() => {
    fetchActionRules();
  }, []);

  const fetchActionRules = useCallback(async (): Promise<ActionRulesResponse> => {
    setLoading(true);
    setError(null);
    try {
      const { content } = await request<ActionRulesBackendResponse>({
        url: API_ENDPOINTS.actionRules.list(),
        method: 'GET',
      });
      const mappedRules = content.data.map(mapBackendToFrontend);
      setActionRules(mappedRules);
      setLoading(false);
      return {
        items: mappedRules,
        total: content.total,
        limit: content.limit,
        offset: content.offset,
      };
    } catch (err) {
      setError('Error fetching action rules');
      setLoading(false);
      throw err;
    }
  }, [request]);

  const createActionRule = useCallback(async (data: ActionRuleFormData): Promise<ActionRule> => {
    setLoading(true);
    setError(null);
    try {
      const backendData = mapFrontendToBackend(data);
      const { content } = await request<ActionRuleBackend>({
        url: API_ENDPOINTS.actionRules.create(),
        method: 'POST',
        data: backendData,
      });
      const mappedRule = mapBackendToFrontend(content);
      setActionRules((prev) => [...prev, mappedRule]);
      setLoading(false);
      return mappedRule;
    } catch (err) {
      setError('Error creating action rule');
      setLoading(false);
      throw err;
    }
  }, [request]);

  const updateActionRule = useCallback(async (id: number, data: ActionRuleFormData): Promise<ActionRule> => {
    setLoading(true);
    setError(null);
    try {
      const backendData = mapFrontendToBackend(data);
      const { content } = await request<ActionRuleBackend>({
        url: API_ENDPOINTS.actionRules.update(id),
        method: 'PUT',
        data: backendData,
      });
      const mappedRule = mapBackendToFrontend(content);
      setActionRules((prev) =>
        prev.map((rule) => (rule.id === id ? mappedRule : rule))
      );
      setLoading(false);
      return mappedRule;
    } catch (err) {
      setError('Error updating action rule');
      setLoading(false);
      throw err;
    }
  }, [request]);

  const deleteActionRule = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await request({
        url: API_ENDPOINTS.actionRules.delete(id),
        method: 'DELETE',
      });
      setActionRules((prev) => prev.filter((rule) => rule.id !== id));
      setLoading(false);
    } catch (err) {
      setError('Error deleting action rule');
      setLoading(false);
      throw err;
    }
  }, [request]);

  const toggleActionRule = useCallback(async (id: number): Promise<ActionRule> => {
    setLoading(true);
    setError(null);
    try {
      const rule = actionRules.find((r) => r.id === id);
      if (!rule) {
        throw new Error('Rule not found');
      }
      const newState = rule.state === 'enabled' ? 'disabled' : 'enabled';
      const updatedData: ActionRuleFormData = {
        name: rule.name,
        action: rule.action,
        state: newState,
        instruction: rule.instruction ?? null,
        trigger: rule.trigger,
      };
      const backendData = mapFrontendToBackend(updatedData);
      const { content } = await request<ActionRuleBackend>({
        url: API_ENDPOINTS.actionRules.update(id),
        method: 'PUT',
        data: backendData,
      });
      const mappedRule = mapBackendToFrontend(content);
      setActionRules((prev) =>
        prev.map((r) => (r.id === id ? mappedRule : r))
      );
      setLoading(false);
      return mappedRule;
    } catch (err) {
      setError('Error toggling action rule');
      setLoading(false);
      throw err;
    }
  }, [actionRules, request]);

  return {
    actionRules,
    loading,
    error,
    fetchActionRules,
    createActionRule,
    updateActionRule,
    deleteActionRule,
    toggleActionRule,
  };
};

export default useActionRulesApi;
