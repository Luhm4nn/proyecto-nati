# CI/CD Pipeline Configuration

Este proyecto usa GitHub Actions para CI/CD automático.

## 🚀 Flujo de trabajo

### Branches y Despliegues

- **`feat/**`\*\* → Solo tests y build (no deploy)
- **`develop`** → Tests + Build + Deploy a Staging (opcional)
- **`main`** → Tests + Build + Deploy a Producción

## ✅ Qué hace el CI/CD

### En cada Push/PR:

1. **Backend**:

   - ✅ Instala dependencias
   - ✅ Genera Prisma Client
   - ✅ Ejecuta linter (ESLint)
   - ✅ Ejecuta tests (Jest)
   - ✅ Compila TypeScript

2. **Frontend**:
   - ✅ Instala dependencias
   - ✅ Ejecuta linter (ESLint)
   - ✅ Compila build de producción

### En push a `main`:

- 🚀 Deploy automático a Vercel (Frontend)
- 🚀 Deploy automático a Render (Backend)

## 🔧 Configuración necesaria

### Secrets de GitHub (Settings → Secrets and variables → Actions)

Necesitas crear estos secrets en tu repositorio:

#### Para Vercel:

```
VERCEL_TOKEN=tu_token_de_vercel
VERCEL_ORG_ID=tu_org_id
VERCEL_PROJECT_ID=tu_project_id
```

**Cómo obtenerlos:**

1. Ve a https://vercel.com/account/tokens
2. Crea un token
3. En tu proyecto Vercel, ve a Settings → General
4. Copia Project ID y Org ID

#### Para Render:

```
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxx
```

**Cómo obtenerlo:**

1. Ve a tu servicio en Render
2. Settings → Deploy Hook
3. Copia la URL del webhook

## 📋 Protección de Branches

### Configuración recomendada en GitHub:

**Para `main`:**

- Require pull request before merging
- Require status checks to pass:
  - `backend-tests`
  - `frontend-build`
- Require conversation resolution before merging

**Para `develop`:**

- Require status checks to pass (opcional)

## 🔄 Workflow recomendado

```bash
# 1. Crear feature branch
git checkout -b feat/nueva-funcionalidad

# 2. Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# 3. Push (se ejecutan tests automáticamente)
git push origin feat/nueva-funcionalidad

# 4. Crear Pull Request a develop
# GitHub Actions valida que todo esté bien

# 5. Merge a develop (tests pasan)
# Opcional: deploy a staging

# 6. Pull Request de develop a main
# Deploy automático a producción cuando se mergea
```

## 🐛 Si los tests fallan

El CI/CD bloqueará el merge. Debes:

1. Ver los logs en GitHub Actions
2. Corregir los errores localmente
3. Hacer push de los cambios
4. El CI/CD se ejecuta automáticamente de nuevo

## 📊 Estado del CI/CD

Puedes ver el estado en:

- Badge en el README
- Tab "Actions" en GitHub
- Checks en cada Pull Request

## 🎯 Próximos pasos

1. Configurar los secrets en GitHub
2. Hacer un push para probar el pipeline
3. (Opcional) Agregar cobertura de tests
4. (Opcional) Agregar notificaciones en Slack/Discord
