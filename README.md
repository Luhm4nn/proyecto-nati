# 🇩🇪 Proyecto Natalia Luhmann

Sistema de gestión de consultas para clases de alemán con autenticación JWT y panel de administración.

🔗 Live Demo: https://deutsch-fur-dich.vercel.app

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Docker (Opcional, para la base de datos)
- PostgreSQL (si no usas Docker)

### 1. Base de Datos (Opción Docker)

Si tienes Docker instalado, levantar la base de datos es trivial:

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd back
npm install
cp .env.example .env

# Configura tu .env con la URL de la base de datos y tus credenciales de admin seguras:
# DATABASE_URL="postgresql://admin:securepassword@localhost:5432/proyecto_nati"
# ADMIN_EMAIL="tu@email.com"
# ADMIN_PASSWORD="tu_password_segura"

npx prisma db push
npm run create:admin  # Crea el usuario admin usando las variables del .env
npm run start:dev     # http://localhost:3000
```

### 3. Frontend

```bash
cd front
npm install
npm run dev          # http://localhost:5173
```

## 🛠️ Stack

- **Backend:** NestJS 11 + Prisma 5 + PostgreSQL (Neon) + JWT
- **Frontend:** React 19 + Vite 7 + React Router 7
- **Seguridad:** Helmet, Throttler, XSS sanitization, DOMPurify
- **Testing:** Jest (35 tests)
- **Deployment:** Vercel (frontend) + Render (backend)

## 🔐 Seguridad Admin

La creación de administradores está protegida y desacoplada de la API pública:

1. **Sin rutas públicas:** No existe endpoint HTTP para crear admins.
2. **Script seguro:** Se utiliza `npm run create:admin` que lee credenciales de Variables de Entorno.
3. **Validación estricta:** El servidor no inicia si faltan las configuraciones de seguridad (`ADMIN_EMAIL`, etc).

## 🎯 Features

### ✅ Implementadas

- **Gestión de Consultas**
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
  - Tabs: Consultas, Inscripciones, Cursos, Novedades y Testimonios
  - Session timeout (30 minutos)
  - Toast notifications
  - Responsive design
- **Seguridad**
  - Rate limiting (5 login/min, 10 consultas/hora)
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
- `POST /consultas` - Crear consulta (rate limited: 10/hora)
- `GET /testimonios` - Listar testimonios activos

### Protegidos (requieren JWT)

**Consultas:**

- `GET /consultas?estado=pendiente&page=1&limit=10` - Listar con paginación
- `GET /consultas/:id` - Ver detalle
- `PATCH /consultas/:id` - Actualizar estado
- `DELETE /consultas/:id` - Eliminar

**Testimonios:**

- `GET /testimonios?todos=true` - Listar todos (incluyendo inactivos)
- `POST /testimonios` - Crear
- `PATCH /testimonios/:id` - Actualizar
- `DELETE /testimonios/:id` - Eliminar

## 🧪 Testing

```bash
cd back
npm test              # Ejecutar tests
npm run test:cov      # Con cobertura
```

**Cobertura actual:**

- ✅ 35 tests pasando
- ✅ Auth: Login, validación, JWT
- ✅ Consultas: CRUD, paginación, sanitización XSS
- ✅ Testimonios: CRUD completo, sanitización
- ✅ E2E: Endpoints con autenticación

## 📝 Scripts Útiles

```bash
# Backend
cd back
npm run start:dev        # Desarrollo
npm run build            # Build producción
npm test                 # Tests
npm run create:admin     # Crea admin desde ENV vars
npm run seed:consultas   # Crea 20 consultas de prueba

# Frontend
cd front
npm run dev              # Desarrollo
npm run build            # Build producción
npm run preview          # Preview del build
```

## 📖 Documentación

- [GUIA_USO.md](./GUIA_USO.md) - Manual para el usuario
- [GUIA-DESARROLLO.md](./GUIA-DESARROLLO.md) - Guía para desarrolladores
