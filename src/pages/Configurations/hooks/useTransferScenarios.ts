import { useState, useCallback, useMemo } from 'react';
import { ActionRule, ActionRuleFormData, ActionRuleSuggestion } from '../types/actionRule';
import useActionRulesApi from './useActionRulesApi';

// Mock suggestions - these are frontend-only and filtered if already exist in backend
const MOCK_SUGGESTIONS: ActionRuleSuggestion[] = [
  {
    id: 'sug-1',
    name: 'Pedido em andamento',
    description: 'O cliente pediu para alterar o pedido que já foi enviado.',
    defaultTrigger: 'Quando o cliente pedir para alterar um pedido que já foi enviado',
  },
  {
    id: 'sug-2',
    name: 'Mensagem de mídia',
    description: 'O cliente enviou uma mensagem de mídia (imagem, vídeo, documento)',
    defaultTrigger: 'Quando o cliente enviar uma mensagem de mídia',
  },
  {
    id: 'sug-3',
    name: 'Reembolso',
    description: 'O cliente quer saber quando vai receber o dinheiro de volta.',
    defaultTrigger: 'Quando o cliente perguntar sobre reembolso ou estorno',
  },
];

export type StatusFilter = 'all' | 'enabled' | 'disabled';

interface UseTransferScenariosResult {
  actionRules: ActionRule[];
  suggestions: ActionRuleSuggestion[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  filteredActionRules: ActionRule[];
  createActionRule: (data: ActionRuleFormData) => Promise<void>;
  updateActionRule: (id: number, data: ActionRuleFormData) => Promise<void>;
  deleteActionRule: (id: number) => Promise<void>;
  toggleActionRule: (id: number) => Promise<void>;
  activateSuggestion: (suggestion: ActionRuleSuggestion) => Promise<void>;
}

const useTransferScenarios = (): UseTransferScenariosResult => {
  const {
    actionRules,
    loading,
    createActionRule: apiCreateActionRule,
    updateActionRule: apiUpdateActionRule,
    deleteActionRule: apiDeleteActionRule,
    toggleActionRule: apiToggleActionRule,
  } = useActionRulesApi();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter action rules based on search query and status filter
  const filteredActionRules = useMemo(() => {
    let filtered = actionRules;

    // Apply status filter (to_review items are always shown)
    if (statusFilter !== 'all') {
      filtered = filtered.filter((rule) => 
        rule.state === 'to_review' || rule.state === statusFilter
      );
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((rule) =>
        rule.name.toLowerCase().includes(query) ||
        rule.trigger.toLowerCase().includes(query) ||
        (rule.instruction && rule.instruction.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [actionRules, searchQuery, statusFilter]);

  // Filter suggestions - don't show if name already exists in action rules
  const suggestions = useMemo(() => {
    const existingNames = new Set(
      actionRules.map((rule) => rule.name.toLowerCase())
    );

    return MOCK_SUGGESTIONS.filter((suggestion) => !existingNames.has(suggestion.name.toLowerCase()));
  }, [actionRules]);

  const createActionRule = useCallback(async (data: ActionRuleFormData) => {
    await apiCreateActionRule(data);
  }, [apiCreateActionRule]);

  const updateActionRule = useCallback(async (id: number, data: ActionRuleFormData) => {
    await apiUpdateActionRule(id, data);
  }, [apiUpdateActionRule]);

  const deleteActionRule = useCallback(async (id: number) => {
    await apiDeleteActionRule(id);
  }, [apiDeleteActionRule]);

  const toggleActionRule = useCallback(async (id: number) => {
    await apiToggleActionRule(id);
  }, [apiToggleActionRule]);

  const activateSuggestion = useCallback(async (suggestion: ActionRuleSuggestion) => {
    const newRuleData: ActionRuleFormData = {
      name: suggestion.name,
      action: 'transfer',
      state: 'enabled',
      instruction: null,
      trigger: suggestion.defaultTrigger,
    };
    await apiCreateActionRule(newRuleData);
  }, [apiCreateActionRule]);

  return {
    actionRules,
    suggestions,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredActionRules,
    createActionRule,
    updateActionRule,
    deleteActionRule,
    toggleActionRule,
    activateSuggestion,
  };
};

export default useTransferScenarios;
