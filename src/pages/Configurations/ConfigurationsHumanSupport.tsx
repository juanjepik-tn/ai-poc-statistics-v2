import React, { useState } from 'react';
import { Box, Button, Icon, Input, Popover, Spinner, Text, Title } from '@nimbus-ds/components';
import { SlidersIcon, PlusCircleIcon, SearchIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import TransferScenarioCard from './components/TransferScenarioCard';
import TransferScenarioModal from './components/TransferScenarioModal';
import DeleteScenarioModal from './components/DeleteScenarioModal';
import useTransferScenarios, { StatusFilter } from './hooks/useTransferScenarios';
import { ActionRule, ActionRuleFormData, ActionRuleSuggestion } from './types/actionRule';

const ConfigurationsHumanSupport: React.FC = () => {
  const { t } = useTranslation('translations');
  const {
    filteredActionRules,
    suggestions,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createActionRule,
    updateActionRule,
    deleteActionRule,
    toggleActionRule,
    activateSuggestion,
  } = useTransferScenarios();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<ActionRule | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingRule, setDeletingRule] = useState<ActionRule | null>(null);

  const handleOpenCreate = () => {
    setEditingRule(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rule: ActionRule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRule(null);
  };

  const handleSave = async (data: ActionRuleFormData) => {
    if (editingRule?.id) {
      await updateActionRule(editingRule.id, data);
    } else {
      await createActionRule(data);
    }
  };

  const handleOpenDelete = (rule: ActionRule) => {
    setDeletingRule(rule);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingRule(null);
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteActionRule(id);
  };

  const handleToggle = async (id: number) => {
    await toggleActionRule(id);
  };

  const handleActivateSuggestion = async (suggestion: ActionRuleSuggestion) => {
    await activateSuggestion(suggestion);
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setFilterPopoverOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap="6">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="4">
        <Box display="flex" flexDirection="column" gap="2" flex="1">
        <Title as="h3">{t('humanSupport.title')}</Title>
        <Text color="neutral-textLow">
          {t('humanSupport.description')}
        </Text>
      </Box>
        <Button appearance="primary" onClick={handleOpenCreate}>
          <Icon source={<PlusCircleIcon />} color="currentColor" />
          {t('humanSupport.addButton')}
        </Button>
      </Box>

      {/* Actions bar */}
      <Box display="flex" alignItems="center" gap="4" flexWrap="wrap">
        <Box flex="1" minWidth="200px">
          <Input
            placeholder={t('humanSupport.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            append={<Icon source={<SearchIcon />} />}
            appendPosition="end"
          />
        </Box>
          <Popover
            visible={filterPopoverOpen}
            onVisibility={setFilterPopoverOpen}
            enabledClick
            enabledDismiss
            arrow={false}
            position="bottom-end"
            padding="small"
            content={
              <Box display="flex" flexDirection="column" gap="2" padding="2">
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family, "CentraNube", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                    fontSize: '14px',
                    color: '#0a0a0a',
                    gap: '8px'
                  }}
                >
                  <input
                    type="radio"
                    name="status-filter"
                    checked={statusFilter === 'all'}
                    onChange={() => handleFilterChange('all')}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: '#0059d5',
                      cursor: 'pointer'
                    }}
                  />
                  {t('humanSupport.filter.all')}
                </label>
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family, "CentraNube", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                    fontSize: '14px',
                    color: '#0a0a0a',
                    gap: '8px'
                  }}
                >
                  <input
                    type="radio"
                    name="status-filter"
                    checked={statusFilter === 'enabled'}
                    onChange={() => handleFilterChange('enabled')}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: '#0059d5',
                      cursor: 'pointer'
                    }}
                  />
                  {t('humanSupport.filter.enabled')}
                </label>
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family, "CentraNube", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                    fontSize: '14px',
                    color: '#0a0a0a',
                    gap: '8px'
                  }}
                >
                  <input
                    type="radio"
                    name="status-filter"
                    checked={statusFilter === 'disabled'}
                    onChange={() => handleFilterChange('disabled')}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: '#0059d5',
                      cursor: 'pointer'
                    }}
                  />
                  {t('humanSupport.filter.disabled')}
                </label>
              </Box>
            }
          >
            <Button appearance="neutral">
              <Icon source={<SlidersIcon />} color="currentColor" />
              {t('humanSupport.filterButton')}
            </Button>
          </Popover>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box display="flex" justifyContent="center" padding="6">
          <Spinner />
        </Box>
      )}

      {/* Action Rules List */}
      {!loading && (
        <Box display="flex" flexDirection="column" gap="4">
          {filteredActionRules.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding="6"
              borderStyle="dashed"
              borderWidth="1"
              borderColor="neutral-surfaceHighlight"
              borderRadius="2"
            >
              <Text color="neutral-textLow">
                {searchQuery
                  ? t('humanSupport.noResults')
                  : t('humanSupport.noScenarios')}
              </Text>
            </Box>
          ) : (
            <Box
              display="grid"
              gap="4"
              gridTemplateColumns={{
                xs: '1fr',
                md: '1fr 1fr',
                lg: '1fr 1fr 1fr',
              }}
            >
              {filteredActionRules.map((rule) => (
                <TransferScenarioCard
                  key={rule.id}
                  actionRule={rule}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onToggle={handleToggle}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Suggestions section */}
      {!loading && suggestions.length > 0 && (
        <Box display="flex" flexDirection="column" gap="4">
          <Title as="h4">{t('humanSupport.suggestionsTitle')}</Title>
          <Box
            display="grid"
            gap="4"
            gridTemplateColumns={{
              xs: '1fr',
              md: '1fr 1fr',
              lg: '1fr 1fr 1fr',
            }}
          >
            {suggestions.map((suggestion) => (
              <TransferScenarioCard
                key={suggestion.id}
                suggestion={suggestion}
                onActivateSuggestion={handleActivateSuggestion}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Modals */}
      <TransferScenarioModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingRule={editingRule}
      />

      <DeleteScenarioModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        actionRule={deletingRule}
      />
    </Box>
  );
};

export default ConfigurationsHumanSupport;
