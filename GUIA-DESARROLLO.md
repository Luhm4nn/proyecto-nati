# 📚 Guía Completa para Desarrolladores - Proyecto Nati

## 📑 Índice

- [Testing](#-testing)
- [Sistema de Toasts](#-sistema-de-toasts)
- [CI/CD](#-cicd)
- [Deployment](#-deployment)
- [Desarrollo Local](#-desarrollo-local)
- [Workflow Git](#-workflow-git)

---

## 🧪 Testing

### Backend (Jest)

**Ejecutar tests:**

```bash
cd back
npm test                 # Todos los tests
npm run test:watch      # Modo watch
npm run test:cov        # Con cobertura
```

**Estructura de tests:**

```
back/src/
├── auth/auth.service.spec.ts           # Tests de autenticación
├── consultas/consultas.service.spec.ts  # Tests de consultas
├── prisma/prisma.service.spec.ts       # Tests de Prisma
└── test/app.e2e-spec.ts               # Tests end-to-end
```

**Cobertura actual:**

- ✅ **35 tests pasando**
- ✅ **Auth:** Login, validación, JWT, rate limiting
- ✅ **Consultas:** CRUD, paginación, validación duplicados, sanitización XSS
- ✅ **Testimonios:** CRUD completo, sanitización XSS, toggle activo/inactivo
- ✅ **E2E:** Endpoints completos con autenticación

**Crear nuevos tests:**

```typescript
// Ejemplo: nuevo-servicio.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { NuevoServicio } from "./nuevo-servicio.service";

describe("NuevoServicio", () => {
  let service: NuevoServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NuevoServicio],
    }).compile();

    service = module.get<NuevoServicio>(NuevoServicio);
  });

  it("debería estar definido", () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend (Simplificado)

Por ahora los tests del frontend están deshabilitados para simplificar.

**Para re-habilitar en el futuro:**

1. Instalar: `npm install --save-dev vitest @testing-library/react`
2. Crear `vitest.config.js`
3. Agregar tests en `src/components/*.test.jsx`

---

## 🎨 Sistema de Toasts

### Implementación Custom (Sin librerías)

**Ubicación:**

- `front/src/contexts/ToastContext.jsx` - Lógica y estado
- `front/src/components/Toast.jsx` - Componente visual
- `front/src/components/Toast.css` - Estilos

### Uso en Componentes

**1. Importar el hook:**

```jsx
import { useToast } from "../contexts/ToastContext";

function MiComponente() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // ...
}
```

**2. Mostrar toasts:**

```jsx
// Success (verde)
showSuccess("¡Operación exitosa!");

// Error (rojo)
showError("Hubo un error al procesar");

// Warning (amarillo)
showWarning("Esta acción no se puede deshacer", 6000); // 6 segundos

// Info (azul)
showInfo("Información importante");
```

**3. Opciones:**

```jsx
// Personalizar duración (en milisegundos)
showSuccess("Mensaje", 5000); // 5 segundos

// Toast permanente (no se cierra automáticamente)
showError("Error crítico", 0);
```

### Tipos de Toast

| Tipo      | Color    | Icono | Uso                  |
| --------- | -------- | ----- | -------------------- |
| `success` | Verde    | ✓     | Operaciones exitosas |
| `error`   | Rojo     | ✕     | Errores y fallos     |
| `warning` | Amarillo | ⚠     | Advertencias         |
| `info`    | Azul     | ℹ     | Información general  |

### Ejemplos Reales del Proyecto

**Login exitoso:**

```jsx
showSuccess(`¡Bienvenida, ${data.user.nombre}!`);
setTimeout(() => navigate("/admin"), 500);
```

**Error de validación:**

```jsx
if (errorData.message.includes("Ya has enviado")) {
  showWarning(errorData.message, 6000);
} else {
  showError(errorData.message);
}
```

**Operación completada:**

```jsx
showSuccess("Consulta eliminada correctamente");
cargarConsultas();
```

---

## 🔄 CI/CD

### ¿Qué hace automáticamente?

Cada vez que hacés `git push`, GitHub Actions ejecuta:

1. **Tests Backend**

   - Instala dependencias
   - Genera Prisma Client
   - Ejecuta ESLint
   - Ejecuta Jest (20 tests)
   - Compila TypeScript

2. **Build Frontend**

   - Instala dependencias
   - Ejecuta ESLint
   - Compila build de producción

3. **Deploy (solo en `main`)**
   - Frontend → Vercel
   - Backend → Render

### Archivos de Configuración

```
.github/workflows/
├── tests.yml        # Tests automáticos (simple)
└── ci-cd.yml        # Pipeline completo con deploy
```

### Ver el Estado

- **En GitHub:** Tab "Actions"
- **En PRs:** Checks aparecen automáticamente
- **Badge en README:** Muestra estado actual

### ¿Qué pasa si fallan los tests?

❌ **El merge está BLOQUEADO**

Debes:

1. Ver logs en GitHub Actions
2. Corregir errores localmente
3. Hacer push de nuevo
4. CI/CD se ejecuta automáticamente

---

## 🚀 Deployment

### Ambientes

| Ambiente       | Branch    | URL                         | Deploy     |
| -------------- | --------- | --------------------------- | ---------- |
| **Desarrollo** | `feat/*`  | localhost                   | Manual     |
| **Staging**    | `develop` | (opcional)                  | Automático |
| **Producción** | `main`    | [vercel.app] + [render.com] | Automático |

### Variables de Entorno

#### Backend

**Local (`.env`):**

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"
JWT_SECRET="dev-secret-key"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

**Producción (Render Dashboard):**

```env
DATABASE_URL="postgresql://...neon.tech/prod_db"
JWT_SECRET="super-secret-prod-key-32-chars-min"
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://tu-app.vercel.app"
```

#### Frontend

**Local (`.env`):**

```env
VITE_API_URL=http://localhost:3000
```

**Producción (Vercel Dashboard):**

```env
VITE_API_URL=https://tu-backend.onrender.com
```

### Deploy Manual

**Backend (Render):**

1. Push a `main`
2. Render detecta cambios automáticamente
3. O click en "Manual Deploy" en dashboard

**Frontend (Vercel):**

1. Push a `main`
2. Vercel detecta cambios automáticamente
3. O `vercel --prod` desde terminal

### Configurar Deploy Automático

**Solo si querés que el CI/CD haga deploy:**

1. **GitHub Secrets** (Settings → Secrets → Actions):

   ```
   VERCEL_TOKEN=tu_token
   VERCEL_ORG_ID=tu_org_id
   VERCEL_PROJECT_ID=tu_project_id
   RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxx
   ```

2. **Cómo obtenerlos:**
   - Vercel Token: https://vercel.com/account/tokens
   - Vercel IDs: Settings del proyecto
   - Render Hook: Settings → Deploy Hook

---

## 💻 Desarrollo Local

### Primera vez

```bash
# 1. Clonar repo
git clone https://github.com/Luhm4nn/proyecto-nati.git
cd proyecto-nati

# 2. Backend
cd back
npm install
cp .env.example .env
# Editar .env con tus credenciales
npx prisma generate
npx prisma db push

# 3. Frontend
cd ../front
npm install
cp .env.example .env
# Editar .env con la URL del backend local
```

### Día a día

**Terminal 1 - Backend:**

```bash
cd back
npm run start:dev  # http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd front
npm run dev        # http://localhost:5173
```

### Comandos Útiles

**Backend:**

```bash
npm run start:dev   # Modo desarrollo con watch
npm run build       # Compilar para producción
npm test            # Ejecutar tests
npm run lint        # Verificar código
npx prisma studio   # Abrir BD en navegador
npx prisma db push  # Sincronizar esquema con BD
```

**Frontend:**

```bash
npm run dev         # Modo desarrollo
npm run build       # Compilar para producción
npm run preview     # Preview del build
npm run lint        # Verificar código
```

---

## 🌿 Workflow Git

### Estructura de Branches

```
main          → Producción (protegida)
  └── develop → Staging/Pre-producción
      └── feat/testing-toast → Features en desarrollo
      └── feat/nueva-funcionalidad
      └── fix/bug-importante
```

### Crear Nueva Feature

```bash
# 1. Asegurarte estar actualizado
git checkout develop
git pull origin develop

# 2. Crear branch
git checkout -b feat/nombre-descriptivo

# 3. Hacer cambios
git add .
git commit -m "feat: descripción del cambio"

# 4. Push
git push origin feat/nombre-descriptivo

# 5. Crear Pull Request en GitHub
# - De feat/nombre → develop
# - Esperar que pasen los tests (CI/CD)
# - Pedir review si es necesario
# - Mergear
```

### Convención de Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, punto y coma, etc.
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

### Ejemplos:

```bash
git commit -m "feat: agregar sistema de toasts"
git commit -m "fix: corregir validación de email"
git commit -m "test: agregar tests para auth service"
git commit -m "docs: actualizar guía de desarrollo"
```

### Pull Requests

**De feature a develop:**

```
feat/testing-toast → develop
- Título: "Agregar sistema de toasts y testing"
- Descripción: Qué cambiaste y por qué
- Asignar reviewers (opcional)
```

**De develop a main:**

```
develop → main
- Solo cuando todo está probado
- Deploy automático a producción
- Tag de versión (opcional): v1.2.0
```

---

## 🔒 Archivos que NO se suben a Git

Verificar que `.gitignore` incluya:

```
# Dependencias
node_modules/

# Variables de entorno
.env
.env.local
.env.test

# Builds
dist/
build/
.next/

# Prisma
prisma/.env

# Logs
*.log

# IDE
.vscode/
.idea/
```

---

## 🐛 Troubleshooting

### Backend no arranca

**Error: Cannot find module**

```bash
cd back
rm -rf node_modules package-lock.json
npm install
```

**Error: DATABASE_URL not found**

```bash
# Verificar que .env existe y tiene DATABASE_URL
cat .env
# O crear desde template
cp .env.example .env
```

**Error: Prisma Client not generated**

```bash
npx prisma generate
```

### Frontend no compila

**Error: VITE_API_URL undefined**

```bash
# Crear .env
echo "VITE_API_URL=http://localhost:3000" > .env
# Reiniciar dev server
npm run dev
```

**Error de CORS**

```bash
# Verificar CORS_ORIGIN en back/.env
# Debe ser: http://localhost:5173 (sin barra al final)
```

### Tests fallan en CI/CD

1. Ejecutar localmente: `npm test`
2. Ver logs en GitHub Actions
3. Verificar que las dependencias estén en package.json
4. Push de nuevo después de corregir

---

## 📞 Soporte

- **Tests:** Ver archivos `.spec.ts` como ejemplos
- **Toasts:** Revisar `ToastContext.jsx` y componentes existentes
- **CI/CD:** Logs en GitHub → Actions
- **Deploy:** Dashboards de Vercel y Render

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0
