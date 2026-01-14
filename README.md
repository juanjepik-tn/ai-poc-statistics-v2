# POC UI Playground 🧪

Entorno de desarrollo local para experimentar con la UI del panel de merchants. 
Funciona con datos mock, sin necesidad de backend ni autenticación Nexo.

## Inicio Rápido

```bash
# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev

# Abrir en el navegador
# http://localhost:5173
```

## Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/admin/chat#/conversations` | Lista de conversaciones multicanal |
| `/admin/chat#/statistics` | Dashboard de estadísticas con gráficos |
| `/admin/chat#/configurations` | Configuraciones de IA y canales |
| `/admin/chat#/onboarding` | Flujo de onboarding (Paso 4 con canales) |
| `/products` | Gestión de productos |
| `/costs` | Información de billing y planes |
| `/template-messages` | Plantillas de mensajes de WhatsApp |
| `/onboarding` | Flujo completo de onboarding |
| `/instances` | Gestión de instancias WhatsApp |

## 🔌 Canales de Mensajería (POC)

### Canales Disponibles

El POC soporta **3 canales de mensajería**:

| Canal | Estado | Onboarding | Tag |
|-------|--------|------------|-----|
| **WhatsApp** | ✅ Completo | QR o Facebook Login | - |
| **Instagram** | ✅ Completo | OAuth con Facebook | 🆕 Nuevo |
| **Facebook Messenger** | ✅ Completo | OAuth con Facebook | 🆕 Nuevo |

---

## 📱 Probar Instagram y Facebook (NUEVO)

### 1. Ver el Onboarding Multicanal

**Ruta:** `/admin/chat#/onboarding`

En el **Paso 4** del onboarding verás los 3 canales:
- WhatsApp (conexión por QR o Facebook Login)
- Instagram (con tag "Nuevo")
- Facebook Messenger (con tag "Nuevo")

> 💡 Los canales comienzan **desconectados** para probar el flujo completo.

### 2. Flujos de Onboarding Independientes

| Canal | Ruta | Pasos |
|-------|------|-------|
| Instagram | `/external/channels/instagram/onboarding` | 4 pasos con stepper visual |
| Facebook | `/external/channels/facebook/onboarding` | 4 pasos (simplificado si Instagram ya conectado) |

### 3. Ver Conversaciones por Canal

**Ruta:** `/admin/chat#/conversations`

- Las primeras conversaciones son de **Facebook Messenger** (para verlas sin scroll)
- Usar el **filtro de canal** en el header para ver solo WhatsApp, Instagram o Facebook
- Cada conversación muestra el **ícono del canal** en la lista y en el header

### 4. Estadísticas por Canal

**Ruta:** `/admin/chat#/statistics`

- **Nuevo gráfico**: "Distribución por canal" (debajo del gráfico de mensajes por día)
  - WhatsApp: 58% (verde)
  - Instagram: 28% (rosa)
  - Facebook: 14% (azul)
- El gráfico **se oculta** si filtrás por un canal específico

### 5. Configuración de Canales

**Ruta:** `/admin/chat#/configurations`

Sección "Instancias" con:
- Tarjeta de WhatsApp (conectar por QR o Facebook)
- Tarjeta de Instagram (con tag "Nuevo")
- Tarjeta de Facebook Messenger (con tag "Nuevo")

---

### Flujo Simplificado de Facebook

Si **Instagram ya está conectado**, el onboarding de Facebook Messenger:
- ✅ Detecta la sesión OAuth existente
- ⏭️ Salta el paso de conexión con Facebook
- 📄 Solo requiere seleccionar la página

### Estados de Conexión (Mock)

Por defecto los canales comienzan **desconectados**. Al completar cada onboarding:
- Se simula la conexión (con delay visual)
- Se actualiza el estado en Redux
- Se muestra el canal como "Conectado" con badge verde

## Estructura de Mocks

Los datos mock están en `src/mocks/`:

- **mock-data.ts** - Todos los datos falsos organizados por módulo
- **mock-interceptor.ts** - Intercepta las llamadas Axios y devuelve mocks

### Modificar Datos Mock

Para cambiar los datos de ejemplo, editar `src/mocks/mock-data.ts`:

```typescript
// Ejemplo: modificar estadísticas
export const mockStatistics = {
  conversations: 1500,  // Cambiar estos valores
  conversations_with_bot_message: 1200,
  // ...
};
```

### Agregar Nuevos Endpoints

En `src/mocks/mock-interceptor.ts`, agregar nuevos handlers:

```typescript
// Agregar al switch de rutas
if (matchRoute(normalizedUrl, '/mi-nuevo-endpoint')) {
  return { data: misDatosMock, status: 200 };
}
```

## Diferencias con Producción

| Aspecto | Producción | POC |
|---------|-----------|-----|
| Autenticación | Nexo (Tiendanube) | Mock automático |
| Datos | API real | Datos mock locales |
| Backend | Requerido | No necesario |

## Tecnologías

- React 18 + TypeScript
- Vite (bundler)
- Nimbus Design System
- Redux Toolkit
- React Router v6
- Recharts (gráficos)

## Tips para Desarrollo

1. **Hot reload**: Los cambios se reflejan automáticamente
2. **Console logs**: Los mocks logean cada request interceptada
3. **Sin backend**: Podés trabajar offline
4. **Editar UI**: Todos los componentes están en `src/components/` y `src/pages/`

## Scripts Disponibles

```bash
yarn dev      # Servidor de desarrollo
yarn build    # Build de producción
yarn preview  # Preview del build
yarn lint     # Verificar errores de lint
yarn format   # Formatear código
yarn test     # Ejecutar tests
```

## 🚀 Deploy en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. Subí el proyecto a un repositorio de GitHub
2. Ingresá a [vercel.com](https://vercel.com) y logueate con tu cuenta de GitHub
3. Click en "Add New..." → "Project"
4. Seleccioná el repositorio
5. Configurá el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `poc-ui-playground` (si el repo tiene múltiples carpetas)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click en "Deploy"

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Loguearte en Vercel
vercel login

# Deploy (desde la carpeta poc-ui-playground)
cd poc-ui-playground
vercel

# Para deploy de producción
vercel --prod
```

### Variables de Entorno (Opcionales)

La POC funciona con datos mock, pero si querés configurar variables de entorno en Vercel:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | - |
| `VITE_CLIENT_ID` | Client ID para auth | - |
| `VITE_API_URL_WS` | WebSocket URL | - |
| `VITE_AMPLITUDE_ENABLE` | Habilitar analytics | `false` |
| `VITE_MAINTENANCE_MODE` | Modo mantenimiento | `false` |

Configurar en: Vercel Dashboard → Project Settings → Environment Variables

---

🎨 ¡Experimentá libremente con la UI!

