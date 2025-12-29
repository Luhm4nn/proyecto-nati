# 🇩🇪 Proyecto Natalia Luhmann

[![Tests](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/tests.yml/badge.svg)](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/tests.yml)
[![CI/CD](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/ci-cd.yml)

Sistema de gestión de solicitudes para clases de alemán con autenticación JWT y panel de administración.
Enlace productivo (deploy en Vercel): https://deutsch-fur-dich.vercel.app

## 🚀 Inicio Rápido

### Backend

```bash
cd back
npm install
cp .env.example .env  # Configurar DATABASE_URL y JWT_SECRET
npx prisma db push
npx prisma generate
npm run start:dev     # http://localhost:3000
```

### Frontend

```bash
cd front
npm install
npm run dev          # http://localhost:5173
```

**Credenciales Admin:** `natalia@luhmann.com` / `natalia2024`

## 🛠️ Stack

- **Backend:** NestJS 11 + Prisma 5 + PostgreSQL (Neon) + JWT
- **Frontend:** React 19 + Vite 7 + React Router 7
- **Seguridad:** Helmet, Throttler, XSS sanitization, DOMPurify
- **Testing:** Jest (35 tests)
- **Deployment:** Vercel (frontend) + Render (backend)

## 🎯 Features

### ✅ Implementadas

- **Sistema de Solicitudes**
  - Formulario de contacto público
  - Paginación (10 por página)
  - Filtros por estado (pendiente/revisada/contactada)
  - Contadores en tiempo real
  - Validación de duplicados (24h)
  
- **Gestión de Testimonios**
  - CRUD completo
  - Toggle activo/inactivo
  - Vista pública filtrada
  - Validación cliente y servidor
  
- **Panel de Administración**
  - Autenticación JWT
  - Tabs: Solicitudes y Testimonios
  - Session timeout (30 minutos)
  - Toast notifications
  - Responsive design
  
- **Seguridad**
  - Rate limiting (5 login/min, 10 solicitudes/hora)
  - Sanitización XSS (backend y frontend)
  - Validación de variables de entorno
  - Headers seguros (Helmet)
  - CORS configurado

### 🚧 Roadmap

- [ ] Notificaciones email
- [ ] Zona horaria Argentina
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Globo 3D de ubicaciones
- [ ] Sistema de reservas

## 📚 API Endpoints

### Públicos

- `POST /auth/login` - Login de admin
- `POST /solicitudes` - Crear solicitud (rate limited: 10/hora)
- `GET /testimonios` - Listar testimonios activos

### Protegidos (requieren JWT)

**Solicitudes:**
- `GET /solicitudes?estado=pendiente&page=1&limit=10` - Listar con paginación
- `GET /solicitudes/:id` - Ver detalle
- `PATCH /solicitudes/:id` - Actualizar estado
- `DELETE /solicitudes/:id` - Eliminar

**Testimonios:**
- `GET /testimonios?todos=true` - Listar todos (incluyendo inactivos)
- `POST /testimonios` - Crear
- `PATCH /testimonios/:id` - Actualizar
- `DELETE /testimonios/:id` - Eliminar

## 🔐 Seguridad

- ✅ JWT con expiración (30 minutos)
- ✅ Rate limiting configurable por endpoint
- ✅ Sanitización XSS (xss + DOMPurify)
- ✅ Timeout de sesión (30 minutos de inactividad)
- ✅ Headers seguros (Helmet con CSP)
- ✅ Prevención de duplicados (24 horas)
- ✅ Validación de DTOs (class-validator)
- ✅ Validación de variables de entorno (Joi)

## 🧪 Testing

```bash
cd back
npm test              # Ejecutar tests
npm run test:cov      # Con cobertura
```

**Cobertura actual:**
- ✅ 35 tests pasando
- ✅ Auth: Login, validación, JWT
- ✅ Solicitudes: CRUD, paginación, sanitización XSS
- ✅ Testimonios: CRUD completo, sanitización
- ✅ E2E: Endpoints con autenticación

## 📝 Scripts Útiles

```bash
# Backend
cd back
npm run start:dev        # Desarrollo
npm run build            # Build producción
npm test                 # Tests
npm run create:admin     # Crear usuario admin
npm run seed:solicitudes # Crear 20 solicitudes de prueba

# Frontend
cd front
npm run dev              # Desarrollo
npm run build            # Build producción
npm run preview          # Preview del build
```

## 📖 Documentación

- [GUIA_USO.md](./GUIA_USO.md) - Manual para el usuario
- [GUIA-DESARROLLO.md](./GUIA-DESARROLLO.md) - Guía para desarrolladores
