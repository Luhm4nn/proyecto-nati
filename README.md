# 🇩🇪 Proyecto Natalia Luhmann

[![Tests](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/tests.yml/badge.svg)](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/tests.yml)
[![CI/CD](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Luhm4nn/proyecto-nati/actions/workflows/ci-cd.yml)

Sistema de gestión de solicitudes de clases de alemán con autenticación y panel de administración.

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

- **Backend:** NestJS + Prisma + PostgreSQL + JWT
- **Frontend:** React + Vite + React Router
- **Seguridad:** Helmet, Throttler, XSS sanitization, DOMPurify

## 📚 API Endpoints

### Públicos

- `POST /auth/login` - Login
- `POST /solicitudes` - Crear solicitud

### Protegidos (requieren JWT)

- `GET /solicitudes` - Listar
- `PATCH /solicitudes/:id` - Actualizar
- `DELETE /solicitudes/:id` - Eliminar

## 🔐 Seguridad

- ✅ JWT con expiración (30min)
- ✅ Rate limiting (5 login/min, 3 solicitudes/hora)
- ✅ Sanitización XSS
- ✅ Timeout de sesión (30min inactividad)
- ✅ Headers seguros (Helmet)
- ✅ Prevención de duplicados (24h)

## 📖 Documentación

- [GUIA_USO.md](./GUIA_USO.md) - Manual para el usuario
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Checklist de producción
