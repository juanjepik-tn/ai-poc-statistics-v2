import { Box, Button, Card, Icon, Link, Modal, Popover, Text, Title, Tag, Toggle, Tooltip } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EllipsisIcon, EyeOffIcon, PlusCircleIcon, TrashIcon } from '@nimbus-ds/icons';

import InstancesQR from '../Instances/InstancesQR';

import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { trackingWhatsappBaileysConnect, trackingWhatsappConnectSuccess } from '@/tracking';
import InstancesDataProvider from '../Instances/InstancesDataProvider';
import WhatsAppAlertsContainer from '@/components/FailedMessageAlertStatus/WhatsAppAlertsContainer';
import { ChannelIcon } from '@/components';
import WhatsAppPreOnboarding from '../OnboardingStepper/components/Channels/WhatsAppPreOnboarding';

type ConfirmAction = {
  type: 'disable-account' | 'delete-account';
  channelLabel: string;
  accountLabel: string;
  onConfirm: () => void;
};

const ConfigurationsInstances: React.FC = () => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPreOnboarding, setShowPreOnboarding] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [disabledChannels, setDisabledChannels] = useState<Record<string, boolean>>({});
  const [disabledAccounts, setDisabledAccounts] = useState<Record<string, boolean>>({});
  const handleOpen = () => setOpen((prevState) => !prevState);
  const handlePreOnboarding = () => setShowPreOnboarding((prevState) => !prevState);

  const confirmMessages: Record<ConfirmAction['type'], { title: string; description: string; buttonLabel: string; appearance: 'danger' | 'primary' }> = {
    'disable-account': {
      title: 'Desativar conta',
      description: 'A conta será desativada e não receberá mais mensagens. Você pode reativá-la a qualquer momento.',
      buttonLabel: 'Desativar',
      appearance: 'primary',
    },
    'delete-account': {
      title: 'Excluir conta',
      description: 'Esta ação é irreversível. Todas as configurações e histórico desta conta serão removidos permanentemente.',
      buttonLabel: 'Excluir',
      appearance: 'danger',
    },
  };

  const handleDisableAccount = (instanceId: string) => {
    setDisabledAccounts((prev) => ({ ...prev, [instanceId]: !prev[instanceId] }));
  };

  const handleDisableChannel = (channelType: string, instances: any[]) => {
    const isCurrentlyDisabled = disabledChannels[channelType];
    setDisabledChannels((prev) => ({ ...prev, [channelType]: !isCurrentlyDisabled }));
    // Also toggle all accounts in this channel
    const updates: Record<string, boolean> = {};
    instances.forEach((inst: any) => {
      updates[inst.id] = !isCurrentlyDisabled;
    });
    setDisabledAccounts((prev) => ({ ...prev, ...updates }));
  };

  const checkInstances = (instances: any, onGenerateQr: any) => {
    if (instances.length > 0) {
      // if all instances are active, show the button to create a new instance
      const allInstancesActive = instances.every((instance: any) => instance.state.name === 'Active');
      if (allInstancesActive) {
        handleOpen();
      } else {
        // if there is at least one instance inactive, reuse it
        const inactiveInstance = instances.find((instance: any) => instance.state.name !== 'Active');
        if (inactiveInstance) {
          onGenerateQr(inactiveInstance?.basePath, inactiveInstance?.id);
        }
      }
    } else {
      handleOpen();
    }
  };

  return (
    <>
      <InstancesDataProvider>
        {({ instances, statusUpdate, loading, onGenerateInstance, qr, cleanQr, onGetInstances, onDeleteInstance, onDisconnectInstance, baileysEnabled }: any) => {
          // Separar instancias por tipo de canal
          const whatsappInstances = instances.filter((instance: any) => 
            instance.channelType === 'whatsapp' || 
            instance.channelName === 'WhatsAppBusiness' || 
            instance.channelName === 'WhatsappBaileys'
          );
          const instagramInstances = instances.filter((instance: any) => 
            instance.channelType === 'instagram' || 
            instance.channelName === 'Instagram'
          );
          const facebookInstances = instances.filter((instance: any) => 
            instance.channelType === 'facebook' || 
            instance.channelName === 'Facebook'
          );
          const whatsappLightInstances = whatsappInstances.filter((instance: any) => instance.channelName === "WhatsappBaileys");         
          const { launchWhatsAppSignup } = useFacebookLogin(onGetInstances);
          
          useEffect(() => {
            if (statusUpdate === 'connected') {
              trackingWhatsappConnectSuccess();
              setOpen(false);
            }
          }, [statusUpdate]);
          useEffect(() => {
            if (qr) {
              !open && handleOpen();
            }
          }, [qr]);

          // Status helpers
          const instagramConnected = instagramInstances.length > 0;
          const facebookConnected = facebookInstances.length > 0;
          
          // Helper para obter identificador da instância
          const getInstanceIdentifier = (inst: any) => {
            if (inst.phoneNumber) return inst.phoneNumber;
            if (inst.phone) return inst.phone;
            if (inst.pageName) return inst.pageName;
            if (inst.username) return inst.username;
            return inst.id;
          };

          // Helper para verificar se está conectado
          const isInstanceConnected = (inst: any) => {
            return inst.actualStatus?.name === 'Connected' || inst.state?.name === 'Active';
          };

          return (
            <Box display="flex" flexDirection="column" gap="6">
              {/* Alertas (se houver) */}
              <WhatsAppAlertsContainer />
              
              {/* Header da seção com contador */}
              <Box display="flex" flexDirection="column" gap="4">
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="2">
                  <Box display="flex" flexDirection="column" gap="1">
                    <Title as="h3">Canais de Mensagens</Title>
                    <Text fontSize="base" color="neutral-textLow">
                      Conecte e gerencie seus canais de comunicação
                    </Text>
                  </Box>
                </Box>

                {/* WhatsApp Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4" style={{ opacity: disabledChannels['whatsapp'] ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: disabledChannels['whatsapp'] ? '#ccc' : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', transition: 'background 0.2s' }}
                        >
                          <ChannelIcon channel="whatsapp" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" gap="2">
                            <Title as="h4">WhatsApp</Title>
                            {disabledChannels['whatsapp'] && (
                              <Tag appearance="neutral" size="small">Desativado</Tag>
                            )}
                          </Box>
                          <Text fontSize="caption" color="neutral-textLow">
                            {whatsappInstances.length} número{whatsappInstances.length !== 1 ? 's' : ''} conectado{whatsappInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Box display="flex" gap="3" alignItems="center">
                        {whatsappInstances.length > 0 && (
                          <Tooltip content={disabledChannels['whatsapp'] ? 'Canal desativado' : 'Canal ativo'}>
                            <Toggle
                              name="whatsapp-channel"
                              checked={!disabledChannels['whatsapp']}
                              onChange={() => handleDisableChannel('whatsapp', whatsappInstances)}
                            />
                          </Tooltip>
                        )}
                        <Button 
                          appearance="primary" 
                          size="small"
                          onClick={handlePreOnboarding}
                        >
                          <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Lista de números WhatsApp */}
                    {whatsappInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {whatsappInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                            style={{ opacity: disabledAccounts[inst.id] ? 0.5 : 1 }}
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                <Box display="flex" gap="2" alignItems="center">
                                  {disabledAccounts[inst.id] ? (
                                    <Tag appearance="neutral" size="small">Desativado</Tag>
                                  ) : (
                                    <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                      {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                    </Tag>
                                  )}
                                  {inst.channelName === 'WhatsAppBusiness' && (
                                    <Tag appearance="primary" size="small">Business</Tag>
                                  )}
                                  {inst.channelName === 'WhatsappBaileys' && (
                                    <Tag appearance="neutral" size="small">Light</Tag>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                            <Popover
                              content={
                                <Box display="flex" flexDirection="column">
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'disable-account',
                                        channelLabel: 'WhatsApp',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => handleDisableAccount(inst.id),
                                      });
                                    }}
                                  >
                                    <Icon source={<EyeOffIcon size="small" />} color="currentColor" />
                                    <Text>{disabledAccounts[inst.id] ? 'Reativar' : 'Desativar'}</Text>
                                  </Button>
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'delete-account',
                                        channelLabel: 'WhatsApp',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => {
                                          if (inst.channelName === 'WhatsAppBusiness') {
                                            onDisconnectInstance(inst.id);
                                          } else {
                                            onDeleteInstance(inst.basePath, inst.id);
                                          }
                                        },
                                      });
                                    }}
                                  >
                                    <Icon source={<TrashIcon size="small" />} color="danger-interactive" />
                                    <Text color="danger-interactive">Excluir</Text>
                                  </Button>
                                </Box>
                              }
                              position="bottom-end"
                              arrow={false}
                              padding="small"
                            >
                              <Box style={{ cursor: 'pointer' }} display="flex" alignItems="center">
                                <EllipsisIcon size="medium" />
                              </Box>
                            </Popover>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">Nenhum número conectado</Text>
                      </Box>
                    )}
                    
                    {/* WhatsApp Light Option */}
                    {baileysEnabled && (
                      <Box display="flex" justifyContent="center">
                        <Link 
                          as="button" 
                          onClick={() => {
                            trackingWhatsappBaileysConnect();
                            checkInstances(whatsappLightInstances, onGenerateInstance);
                          }}
                        >
                          <Text fontSize="caption" color="primary-interactive">
                            {t('instances.whatsappLight')}
                          </Text>
                        </Link>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Instagram Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4" style={{ opacity: disabledChannels['instagram'] ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: disabledChannels['instagram'] ? '#ccc' : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', transition: 'background 0.2s' }}
                        >
                          <ChannelIcon channel="instagram" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" gap="2">
                            <Title as="h4">Instagram</Title>
                            {disabledChannels['instagram'] && (
                              <Tag appearance="neutral" size="small">Desativado</Tag>
                            )}
                          </Box>
                          <Text fontSize="caption" color="neutral-textLow">
                            {instagramInstances.length} conta{instagramInstances.length !== 1 ? 's' : ''} conectada{instagramInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Box display="flex" gap="3" alignItems="center">
                        {instagramInstances.length > 0 && (
                          <Tooltip content={disabledChannels['instagram'] ? 'Canal desativado' : 'Canal ativo'}>
                            <Toggle
                              name="instagram-channel"
                              checked={!disabledChannels['instagram']}
                              onChange={() => handleDisableChannel('instagram', instagramInstances)}
                            />
                          </Tooltip>
                        )}
                        <Button 
                          appearance="primary" 
                          size="small"
                          onClick={() => navigate('/external/channels/instagram/onboarding')}
                        >
                          <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Lista de cuentas Instagram */}
                    {instagramInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {instagramInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                            style={{ opacity: disabledAccounts[inst.id] ? 0.5 : 1 }}
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                {disabledAccounts[inst.id] ? (
                                  <Tag appearance="neutral" size="small">Desativado</Tag>
                                ) : (
                                  <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                    {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                  </Tag>
                                )}
                              </Box>
                            </Box>
                            <Popover
                              content={
                                <Box display="flex" flexDirection="column">
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'disable-account',
                                        channelLabel: 'Instagram',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => handleDisableAccount(inst.id),
                                      });
                                    }}
                                  >
                                    <Icon source={<EyeOffIcon size="small" />} color="currentColor" />
                                    <Text>{disabledAccounts[inst.id] ? 'Reativar' : 'Desativar'}</Text>
                                  </Button>
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'delete-account',
                                        channelLabel: 'Instagram',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => {
                                          onDeleteInstance(inst.basePath, inst.id);
                                        },
                                      });
                                    }}
                                  >
                                    <Icon source={<TrashIcon size="small" />} color="danger-interactive" />
                                    <Text color="danger-interactive">Excluir</Text>
                                  </Button>
                                </Box>
                              }
                              position="bottom-end"
                              arrow={false}
                              padding="small"
                            >
                              <Box style={{ cursor: 'pointer' }} display="flex" alignItems="center">
                                <EllipsisIcon size="medium" />
                              </Box>
                            </Popover>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">Nenhuma conta conectada</Text>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Facebook Messenger Section */}
                <Card padding="base">
                  <Box display="flex" flexDirection="column" gap="4" style={{ opacity: disabledChannels['facebook'] ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="3">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="40px"
                          height="40px"
                          borderRadius="full"
                          style={{ background: disabledChannels['facebook'] ? '#ccc' : 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)', transition: 'background 0.2s' }}
                        >
                          <ChannelIcon channel="facebook" size="medium" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" gap="2">
                            <Title as="h4">Messenger</Title>
                            {disabledChannels['facebook'] && (
                              <Tag appearance="neutral" size="small">Desativado</Tag>
                            )}
                          </Box>
                          <Text fontSize="caption" color="neutral-textLow">
                            {facebookInstances.length} página{facebookInstances.length !== 1 ? 's' : ''} conectada{facebookInstances.length !== 1 ? 's' : ''}
                          </Text>
                        </Box>
                      </Box>
                      <Box display="flex" gap="3" alignItems="center">
                        {facebookInstances.length > 0 && (
                          <Tooltip content={disabledChannels['facebook'] ? 'Canal desativado' : 'Canal ativo'}>
                            <Toggle
                              name="facebook-channel"
                              checked={!disabledChannels['facebook']}
                              onChange={() => handleDisableChannel('facebook', facebookInstances)}
                            />
                          </Tooltip>
                        )}
                        <Button 
                          appearance="primary" 
                          size="small"
                          onClick={() => navigate('/external/channels/facebook/onboarding')}
                        >
                          <Icon source={<PlusCircleIcon size={16} />} color="currentColor" />
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Lista de páginas Facebook */}
                    {facebookInstances.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap="2">
                        {facebookInstances.map((inst: any) => (
                          <Box 
                            key={inst.id}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            padding="3"
                            borderRadius="base"
                            backgroundColor="neutral-surface"
                            style={{ opacity: disabledAccounts[inst.id] ? 0.5 : 1 }}
                          >
                            <Box display="flex" alignItems="center" gap="3">
                              <Box display="flex" flexDirection="column">
                                <Text fontWeight="medium">{getInstanceIdentifier(inst)}</Text>
                                {disabledAccounts[inst.id] ? (
                                  <Tag appearance="neutral" size="small">Desativado</Tag>
                                ) : (
                                  <Tag appearance={isInstanceConnected(inst) ? 'success' : 'warning'} size="small">
                                    {isInstanceConnected(inst) ? 'Conectado' : 'Desconectado'}
                                  </Tag>
                                )}
                              </Box>
                            </Box>
                            <Popover
                              content={
                                <Box display="flex" flexDirection="column">
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'disable-account',
                                        channelLabel: 'Messenger',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => handleDisableAccount(inst.id),
                                      });
                                    }}
                                  >
                                    <Icon source={<EyeOffIcon size="small" />} color="currentColor" />
                                    <Text>{disabledAccounts[inst.id] ? 'Reativar' : 'Desativar'}</Text>
                                  </Button>
                                  <Button
                                    appearance="transparent"
                                    onClick={() => {
                                      setConfirmAction({
                                        type: 'delete-account',
                                        channelLabel: 'Messenger',
                                        accountLabel: getInstanceIdentifier(inst),
                                        onConfirm: () => {
                                          onDeleteInstance(inst.basePath, inst.id);
                                        },
                                      });
                                    }}
                                  >
                                    <Icon source={<TrashIcon size="small" />} color="danger-interactive" />
                                    <Text color="danger-interactive">Excluir</Text>
                                  </Button>
                                </Box>
                              }
                              position="bottom-end"
                              arrow={false}
                              padding="small"
                            >
                              <Box style={{ cursor: 'pointer' }} display="flex" alignItems="center">
                                <EllipsisIcon size="medium" />
                              </Box>
                            </Popover>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="4"
                        borderRadius="base"
                        backgroundColor="neutral-surface"
                      >
                        <Text color="neutral-textLow">Nenhuma página conectada</Text>
                      </Box>
                    )}
                    
                    {/* Quick connect notice */}
                    {instagramConnected && !facebookConnected && (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        padding="2"
                        borderRadius="base"
                        backgroundColor="primary-surface"
                      >
                        <Text fontSize="caption" color="primary-textHigh">
                          Conecte rapidamente usando sua conta do Instagram
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Box>

              {/* Modal QR WhatsApp */}
              <Modal open={open} onDismiss={() => { handleOpen(); cleanQr(); }} padding="none" maxWidth="752px">
                <Modal.Body padding="none">
                  <InstancesQR
                    loading={loading}
                    onGenerateQr={onGenerateInstance}
                    onStatusUpdate={statusUpdate}
                    qr={qr}
                    default_whatsapp={{ id: 2, name: "WhatsappBaileys" }}
                  />
                </Modal.Body>
              </Modal>

              {/* Modal Pre-Onboarding WhatsApp Business */}
              <Modal open={showPreOnboarding} onDismiss={handlePreOnboarding} maxWidth="400px">
                <Modal.Body padding="none">
                  <WhatsAppPreOnboarding 
                    onContinue={() => {
                      handlePreOnboarding();
                      launchWhatsAppSignup();
                    }}
                    onCancel={handlePreOnboarding}
                  />
                </Modal.Body>
              </Modal>

              {/* Modal de Confirmação de Ações (contas) */}
              <Modal 
                open={confirmAction !== null} 
                onDismiss={() => setConfirmAction(null)} 
                maxWidth="420px"
              >
                <Modal.Header title={confirmAction ? confirmMessages[confirmAction.type].title : ''} />
                <Modal.Body padding="base">
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap="2" 
                      padding="3" 
                      borderRadius="base" 
                      backgroundColor="neutral-surface"
                    >
                      <Text fontWeight="bold">{confirmAction?.channelLabel}</Text>
                      <Text color="neutral-textLow">{'>'}</Text>
                      <Text>{confirmAction?.accountLabel}</Text>
                    </Box>
                    <Text color="neutral-textLow">
                      {confirmAction ? confirmMessages[confirmAction.type].description : ''}
                    </Text>
                  </Box>
                </Modal.Body>
                <Modal.Footer>
                  <Box display="flex" gap="2" justifyContent="flex-end" width="100%">
                    <Button 
                      appearance="neutral" 
                      onClick={() => setConfirmAction(null)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      appearance={confirmAction ? confirmMessages[confirmAction.type].appearance : 'primary'}
                      onClick={() => {
                        if (confirmAction) {
                          confirmAction.onConfirm();
                          setConfirmAction(null);
                        }
                      }}
                    >
                      {confirmAction ? confirmMessages[confirmAction.type].buttonLabel : ''}
                    </Button>
                  </Box>
                </Modal.Footer>
              </Modal>
            </Box>
          );
        }}
      </InstancesDataProvider>
    </>
  );
};
export default ConfigurationsInstances;
