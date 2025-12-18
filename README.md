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
| `/statistics` | Dashboard de estadísticas con gráficos |
| `/conversations` | Lista de conversaciones de WhatsApp |
| `/configurations` | Configuraciones de IA y reglas |
| `/products` | Gestión de productos |
| `/costs` | Información de billing y planes |
| `/template-messages` | Plantillas de mensajes de WhatsApp |
| `/onboarding` | Flujo de onboarding |
| `/instances` | Gestión de instancias WhatsApp |

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

