import React, { useState } from 'react';
import { Box, Button, Icon, Input, Link, Popover, Spinner, Text, Title } from '@nimbus-ds/components';
import { SlidersIcon, PlusCircleIcon, SearchIcon, QuestionCircleIcon, ExternalLinkIcon } from '@nimbus-ds/icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import TransferScenarioCard from './components/TransferScenarioCard';
import TransferScenarioModal from './components/TransferScenarioModal';
import DeleteScenarioModal from './components/DeleteScenarioModal';
import useTransferScenarios, { StatusFilter } from './hooks/useTransferScenarios';
import { ActionRule, ActionRuleFormData, ActionRuleSuggestion } from './types/actionRule';
import { useWindowWidth } from '@/hooks';

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
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth < 768;

  type ViewMode = 'list' | '2col' | '3col';
  const [viewMode, setViewMode] = useState<ViewMode>('3col');
  const effectiveViewMode: ViewMode = isMobile ? 'list' : viewMode;

  const viewModeLabels: Record<ViewMode, string> = {
    list: 'Lista',
    '2col': '2 colunas',
    '3col': '3 colunas',
  };

  const cycleViewMode = () => {
    const modes: ViewMode[] = ['list', '2col', '3col'];
    const idx = modes.indexOf(viewMode);
    setViewMode(modes[(idx + 1) % modes.length]);
  };

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
    const toastId = toast.loading(t('humanSupport.toast.loading'));
    try {
      await toggleActionRule(id);
      toast.success(t('humanSupport.toast.toggleSuccess'), { id: toastId });
    } catch {
      toast.error(t('humanSupport.toast.toggleError'), { id: toastId });
    }
  };

  const handleActivateSuggestion = async (suggestion: ActionRuleSuggestion) => {
    const toastId = toast.loading(t('humanSupport.toast.loading'));
    try {
      await activateSuggestion(suggestion);
      toast.success(t('humanSupport.toast.activateSuccess'), { id: toastId });
    } catch {
      toast.error(t('humanSupport.toast.activateError'), { id: toastId });
    }
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setFilterPopoverOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" style={{ maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box display="flex" flexDirection="column" gap="2">
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="2">
          <Title as="h4" style={{ flex: '1 1 0', minWidth: 0 }}>{t('humanSupport.title')}</Title>
          <Button appearance="primary" onClick={handleOpenCreate} style={{ flexShrink: 0 }}>
            <Icon source={<PlusCircleIcon />} color="currentColor" />
            {t('humanSupport.addButton')}
          </Button>
        </Box>
        <Text color="neutral-textHigh">
          {t('humanSupport.description')}
        </Text>
      </Box>

      {/* Content: search + cards + suggestions */}
      <Box display="flex" flexDirection="column" gap="4" paddingTop="4">
        {!isMobile && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            gap: '8px',
            background: '#fff',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}>
            {(['list', '2col', '3col'] as const).map((mode) => (
              <Button
                key={mode}
                appearance={viewMode === mode ? 'primary' : 'neutral'}
                onClick={() => setViewMode(mode)}
                size="small"
              >
                {viewModeLabels[mode]}
              </Button>
            ))}
          </div>
        )}

        {/* Search bar */}
        <Box display="flex" gap="2" alignItems="start">
          <Box flex="1">
            <Input
              placeholder={t('humanSupport.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              append={<Icon source={<SearchIcon />} />}
              appendPosition="start"
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
                    style={{ width: '16px', height: '16px', accentColor: '#0059d5', cursor: 'pointer' }}
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
                    style={{ width: '16px', height: '16px', accentColor: '#0059d5', cursor: 'pointer' }}
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
                    style={{ width: '16px', height: '16px', accentColor: '#0059d5', cursor: 'pointer' }}
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

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" padding="6">
            <Spinner />
          </Box>
        )}

        {/* Scrollable cards area */}
        {!loading && (
          <Box>
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
                  display={effectiveViewMode === 'list' ? 'flex' : 'grid'}
                  gap={effectiveViewMode === 'list' ? '2' : '4'}
                  flexDirection={effectiveViewMode === 'list' ? 'column' : undefined}
                  gridTemplateColumns={effectiveViewMode !== 'list' ? {
                    xs: '1fr',
                    md: `repeat(${effectiveViewMode === '2col' ? 2 : 3}, 1fr)`,
                  } : undefined}
                  style={effectiveViewMode !== 'list' ? { gridAutoRows: '1fr' } : undefined}
                >
                  {filteredActionRules.map((rule) => (
                    <TransferScenarioCard
                      key={rule.id}
                      actionRule={rule}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      onToggle={handleToggle}
                      layout={effectiveViewMode === 'list' ? 'list' : 'grid'}
                    />
                  ))}
                </Box>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <Text fontSize="base" color="neutral-textLow">
                    {t('humanSupport.suggestionsTitle')}
                  </Text>
                  <Box
                    display={effectiveViewMode === 'list' ? 'flex' : 'grid'}
                    gap={effectiveViewMode === 'list' ? '2' : '4'}
                    flexDirection={effectiveViewMode === 'list' ? 'column' : undefined}
                    gridTemplateColumns={effectiveViewMode !== 'list' ? {
                      xs: '1fr',
                      md: `repeat(${effectiveViewMode === '2col' ? 2 : 3}, 1fr)`,
                    } : undefined}
                    style={effectiveViewMode !== 'list' ? { gridAutoRows: '1fr' } : undefined}
                  >
                    {suggestions.map((suggestion) => (
                      <TransferScenarioCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onActivateSuggestion={handleActivateSuggestion}
                        layout={effectiveViewMode === 'list' ? 'list' : 'grid'}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Help link */}
      <Box display="flex" justifyContent="center" padding="4">
        <Link
          as="a"
          href="https://atendimento.nuvemshop.com.br/pt_BR/nuvem-chat"
          target="_blank"
          appearance="primary"
          textDecoration="none"
        >
          <Box display="flex" alignItems="center" gap="2">
            <Icon source={<QuestionCircleIcon />} color="primary-interactive" />
            <Text color="primary-interactive" fontSize="base">
              {t('humanSupport.helpLink')}
            </Text>
            <Icon source={<ExternalLinkIcon />} color="primary-interactive" />
          </Box>
        </Link>
      </Box>

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
