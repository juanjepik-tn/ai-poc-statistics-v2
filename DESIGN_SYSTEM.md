# Design System - Nuvem Chat

Este documento define os tokens de design, padrões e diretrizes de UI/UX para o projeto Nuvem Chat.

## Índice

1. [Regra do 8 - Sistema de Espaçamento](#regra-do-8---sistema-de-espaçamento)
2. [Hierarquia de Botões](#hierarquia-de-botões)
3. [Tipografia](#tipografia)
4. [Cores e Estados](#cores-e-estados)
5. [Componentes Reutilizáveis](#componentes-reutilizáveis)
6. [Tamanhos de Ícones de Canal](#tamanhos-de-ícones-de-canal)
7. [Acessibilidade](#acessibilidade)

---

## Regra do 8 - Sistema de Espaçamento

**OBRIGATÓRIO:** Todo o layout deve seguir estritamente a Regra do 8.

### Escala de Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `gap="1"` | 8px | Entre elementos muito relacionados (ícone + texto) |
| `gap="2"` | 16px | Entre elementos de um grupo |
| `gap="3"` | 24px | Entre grupos dentro de uma seção |
| `gap="4"` | 32px | Entre seções relacionadas |
| `gap="6"` | 48px | Entre seções principais da página |

### Paddings por Contexto

| Contexto | Valor | Exemplo |
|----------|-------|---------|
| Card interno | `padding="base"` (16px) | Cards de canal, configurações |
| Seção expandida | `padding="3"` (24px) | ExpandableSection |
| Página/Container | `padding="6"` (48px) | WhatsAppPreOnboarding |
| Badge/Tag | `paddingY="1"` + `paddingX="2"` | Status conectado |

### Aplicações Práticas

**Card interno (NÃO use padding duplo):**
```tsx
// ✅ CORRETO
<Card padding="base">
  <Box display="flex" flexDirection="column" gap="3">
    {/* Conteúdo do card */}
  </Box>
</Card>

// ❌ INCORRETO - padding duplicado
<Card padding="base">
  <Box padding="2" gap="4">  {/* NÃO faça isso */}
    {/* Conteúdo */}
  </Box>
</Card>
```

**Seções da página:**
```tsx
<Box display="flex" flexDirection="column" gap="6">
  <Section1 />
  <Section2 />
</Box>
```

**Grid de cards:**
```tsx
<Box 
  display="grid" 
  gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
  gap="4"
>
  <Card1 />
  <Card2 />
  <Card3 />
</Box>
```

---

## Hierarquia de Botões

### Botão Primário
**Uso:** Ação principal da tela - deve haver apenas 1 por contexto.

```tsx
<Button appearance="primary" size="medium">
  Conectar
</Button>
```

**Exemplos:**
- "Conectar" (canais)
- "Salvar" (configurações)
- "Continuar" (onboarding)
- "Iniciar teste grátis"

**Diretrizes:**
- Máximo 1 botão primário por tela/seção
- Sempre visível e facilmente identificável
- Texto claro e orientado à ação (verbo no infinitivo)

---

### Botão Secundário
**Uso:** Ações complementares à ação principal.

```tsx
<Button appearance="default" size="small">
  Configurar
</Button>
```

**Exemplos:**
- "Configurar" (após conectar canal)
- "Editar"
- "Ver detalhes"

**Diretrizes:**
- Pode haver múltiplos na mesma tela
- Não compete visualmente com o botão primário
- Geralmente menor (`size="small"`)

---

### Botão Terciário
**Uso:** Ações menos frequentes, navegação secundária.

```tsx
<Link as="button" appearance="neutral" onClick={handleClick}>
  Voltar
</Link>
```

**Exemplos:**
- "Voltar"
- "Cancelar"
- "Precisa de ajuda?"

**Diretrizes:**
- Aparência de link ou botão transparente
- Não deve desviar atenção das ações principais
- Geralmente posicionado abaixo ou ao lado das ações primárias

---

## Tipografia

### Hierarquia de Textos

#### Títulos de Página
```tsx
<Title as="h2">Conectar WhatsApp Business</Title>
```

#### Títulos de Seção
```tsx
<Title as="h3">Canais de Mensagens</Title>
```

#### Títulos de Subsection
```tsx
<Title as="h4">Antes de começar</Title>
```

#### Texto Primário
```tsx
<Text fontSize="base">
  Conteúdo principal da interface
</Text>
```

#### Texto Secundário / Descritivo
```tsx
<Text fontSize="caption" color="neutral-textLow">
  Informação complementar ou detalhes
</Text>
```

#### Labels / Status
```tsx
<Text fontSize="caption" fontWeight="medium">
  Status
</Text>
```

#### Destaque / Badge
```tsx
<Text fontSize="highlight" fontWeight="bold">
  WhatsApp
</Text>
```

### Cores de Texto

```tsx
// Texto principal
color="neutral-textHigh" // padrão

// Texto secundário
color="neutral-textLow"

// Texto de sucesso
color="success-textHigh"

// Texto de erro
color="danger-textHigh"

// Texto primário (links, CTAs)
color="primary-interactive"
```

---

## Tamanhos de Ícones de Canal

Os ícones de canal (WhatsApp, Instagram, Messenger) devem ter tamanhos suficientes para reconhecimento visual rápido.

### Escala de Tamanhos

| Tamanho | Dimensão | Container | Uso |
|---------|----------|-----------|-----|
| `small` | 24px | - | Inline com texto, botões |
| `medium` | 32px | 56px | Cards resumidos |
| `large` | 48px | 80px | Cards de destaque, hero |

### Exemplo de Container com Gradiente

```tsx
{/* Container do ícone - tamanho destaque */}
<Box
  display="flex"
  alignItems="center"
  justifyContent="center"
  width="80px"
  height="80px"
  borderRadius="full"
  style={{
    background: CHANNEL_GRADIENTS[channel],
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
  }}
>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="64px"
    height="64px"
    borderRadius="full"
    backgroundColor="neutral-background"
  >
    <ChannelIcon channel={channel} size="large" />
  </Box>
</Box>
```

---

## Cores e Estados

### Estados de Canais

| Estado | Borda | Badge | Uso |
|--------|-------|-------|-----|
| Desconectado | `transparent` | - | Card neutro |
| Conectando | `#2196F3` | `primary` | Loading |
| Conectado | `#00AB6B` | `success` | Sucesso |
| Erro | `#E53E3E` | `danger` | Falha |

#### Conectado
```tsx
<Card style={{ 
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#00AB6B' // success color
}}>
  {/* Conteúdo */}
</Card>
```

#### Status Badge (usar ícone, NÃO emoji)
```tsx
// ✅ CORRETO - usar ícone Nimbus
<Box display="flex" alignItems="center" gap="1" backgroundColor="success-surface" borderRadius="full">
  <Icon source={<CheckCircleIcon size={14} />} color="success-interactive" />
  <Text color="success-textHigh" fontSize="caption" fontWeight="medium">
    Conectado
  </Text>
</Box>

// ❌ INCORRETO - não usar emoji
<Text>✓ Conectado</Text>
```

### Backgrounds de Status

```tsx
// Sucesso
backgroundColor="success-surface"

// Informação/Primário
backgroundColor="primary-surface"

// Neutro
backgroundColor="neutral-surface"

// Alerta
backgroundColor="warning-surface"
```

### Gradientes de Canais

```tsx
const CHANNEL_GRADIENTS = {
  whatsapp: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  instagram: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  facebook: 'linear-gradient(135deg, #1877F2 0%, #0D65D9 100%)',
};
```

---

## Componentes Reutilizáveis

### ChannelCard

Card padronizado para exibir canais de mensagens.

```tsx
import { ChannelCard } from '@/components';

<ChannelCard
  channel="whatsapp" // 'whatsapp' | 'instagram' | 'facebook'
  status="connected" // 'connected' | 'disconnected'
  identifier="+55 11 99999-9999" // opcional
  isNew={false} // mostra badge "Nuevo"
  quickConnect={false} // mostra "Conexión rápida"
  onConnect={() => {}}
  onConfigure={() => {}} // opcional
  onMore={() => {}} // opcional
/>
```

**Estados visuais:**
- Conectado: borda verde, badge "✓ Conectado", mostra identificador
- Não conectado: borda transparente, botão "Conectar"

---

### ExpandableSection

Componente para conteúdo expansível (progressive disclosure).

```tsx
import { ExpandableSection } from '@/components';

<ExpandableSection title="Ver checklist completo">
  <Box display="flex" flexDirection="column" gap="2">
    {/* Conteúdo expandido */}
  </Box>
</ExpandableSection>
```

**Uso recomendado:**
- Detalhes técnicos que não são essenciais
- Checklists completos
- Informações avançadas

---

## Acessibilidade

### Contrast Ratio

Todas as combinações de texto/background devem ter no mínimo:
- **4.5:1** para texto normal
- **3:1** para texto grande (18px+ ou 14px+ bold)

### Focus States

Todos os elementos interativos devem ter estado de foco visível:

```tsx
<Button appearance="primary">
  {/* Nimbus DS já fornece focus states */}
</Button>
```

### Screen Readers

#### Textos alternativos
```tsx
// Ícones decorativos não precisam de alt
<ChannelIcon channel="whatsapp" size="medium" />

// Ícones informativos devem ter label
<Icon source={<InfoIcon />} aria-label="Informação" />
```

#### Landmarks
```tsx
<main>
  <section aria-label="Canais de Mensagens">
    {/* Conteúdo */}
  </section>
</main>
```

---

## Checklist de Qualidade

Ao criar novos componentes ou telas, verifique:

- [ ] Usa hierarquia de botões correta (1 primário por contexto)
- [ ] Espaçamento consistente (gap: 6 → 4 → 3 → 2 → 1)
- [ ] Tipografia hierárquica (Title h2/h3/h4 → Text base/caption)
- [ ] Estados visuais claros (conectado vs desconectado)
- [ ] Contrast ratio adequado (4.5:1 mínimo)
- [ ] Focus states visíveis
- [ ] Responsivo (xs/md breakpoints)
- [ ] Textos traduzíveis (usa i18n)
- [ ] Redução de texto desnecessário (menos é mais)
- [ ] Progressive disclosure quando aplicável

---

## Referências

- **Nimbus Design System:** https://nimbus.tiendanube.com/
- **Heurísticas de Nielsen:** https://www.nngroup.com/articles/ten-usability-heuristics/
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Padrões de Interação

### Fluxo de Conexão de Canais

Todos os canais devem seguir o mesmo padrão de interação:

1. **Clicar em "Conectar"** → Abre modal com pré-onboarding
2. **Pré-onboarding** → Mostra requisitos essenciais e checklist
3. **Iniciar conexão** → Abre fluxo OAuth ou QR

**NÃO** navegue para página externa diretamente. Sempre use modal para manter contexto.

### Estrutura de Onboarding (Welcome Screen)

Todas as telas de boas-vindas de canal devem seguir esta estrutura:

```tsx
<Box display="flex" flexDirection="column" alignItems="center" gap="6" padding="6">
  {/* 1. Hero - Ícone do canal com gradiente (96x80px) + badge "Nuevo" */}
  
  {/* 2. Título e Subtítulo - gap="1" */}
  
  {/* 3. Features - card success-surface com checkmarks */}
  
  {/* 4. Requisitos - card neutral-surface com bullets coloridos */}
  
  {/* 5. CTA Principal - botão primário com ícone do canal */}
  
  {/* 6. Link secundário - "Cancelar" */}
</Box>
```

---

## Changelog

- **2026-01-28:** Refinamento de UI Pixel Perfect
  - Implementada Regra do 8 estritamente
  - Aumentados tamanhos de ícones de canal (small: 24px, medium: 32px, large: 48px)
  - ChannelCard: removido padding duplicado, adicionado ícone CheckCircle
  - WhatsAppPreOnboarding: substituídos emojis por ícones Nimbus
  - ExpandableSection: adicionado ícone chevron, corrigido padding
  - ConfigurationsInstances: adicionado contador de canais conectados
  - InstancesQR: layout grid responsivo, instruções numeradas
  - Step1Welcome (Instagram/Facebook): padronizados containers e gaps
  - Documentação atualizada com novas diretrizes

- **2026-01-28:** Documentação inicial do Design System
  - Hierarquia de botões definida
  - Tokens de espaçamento
  - Tipografia padronizada
  - Componentes ChannelCard e ExpandableSection criados
