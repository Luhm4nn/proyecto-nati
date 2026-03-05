# Alemán Para Vos

Plataforma web completa para la gestión de cursos de alemán. Incluye sitio público, panel de administración y API REST con autenticación.

🔗 **Sitio en producción:** [alemanparavos.com](https://alemanparavos.com)

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Funcionalidades](#funcionalidades)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Testing](#testing)
- [Seguridad](#seguridad)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Backend** | NestJS · Prisma ORM · PostgreSQL |
| **Frontend** | React · Vite · React Router |
| **Autenticación** | JWT (Passport) · bcrypt |
| **Almacenamiento** | Cloudinary (imágenes y comprobantes) |
| **Email** | Resend |
| **Seguridad** | Helmet · Throttler · XSS sanitization · DOMPurify · Joi (env validation) |
| **Testing** | Jest (backend) · Testing Library (frontend) |
| **Infraestructura** | Vercel (frontend) · Render (backend) · PostgreSQL cloud |

---

## Arquitectura

```
aleman-para-vos/
├── back/                   # API REST (NestJS)
│   ├── src/
│   │   ├── auth/           # Autenticación JWT
│   │   ├── consultas/      # Mensajes de contacto
│   │   ├── cursos/         # Cursos y dictados
│   │   ├── inscripciones/  # Registros de alumnos
│   │   ├── novedades/      # Anuncios y noticias
│   │   ├── testimonios/    # Testimonios de alumnos
│   │   ├── materiales/     # Recursos descargables
│   │   └── datos-transferencia/ # Info bancaria para pagos
│   └── prisma/             # Esquema y migraciones
└── front/                  # SPA (React + Vite)
    └── src/
        ├── components/     # Secciones públicas y panel admin
        ├── contexts/       # Auth, Toast
        └── hooks/          # Lógica reutilizable
```

---

## Funcionalidades

### Sitio público

- Landing con secciones: Hero, Características, Cursos, Testimonios, Preguntas frecuentes, Novedades y Contacto.
- Formulario de contacto con validación de duplicados y rate limiting.
- Visualización de cursos disponibles con precios (pesos y dólares).
- Sistema de inscripción online con subida de comprobante de pago.
- Materiales de estudio accesibles para alumnos.

### Panel de administración (rutas protegidas)

| Módulo | Capacidades |
|---|---|
| **Consultas** | Listado paginado, filtros por estado, actualización de estado |
| **Inscripciones** | Gestión de alumnos, visualización de comprobantes, cambio de estado |
| **Cursos** | CRUD de cursos, gestión de dictados con horarios y cupos |
| **Novedades** | Publicación y edición de anuncios con imágenes |
| **Testimonios** | CRUD, activación/desactivación de visibilidad |
| **Materiales** | Subida y gestión de recursos descargables |
| **Datos de cobro** | Gestión de alias/CBU para transferencias nacionales e internacionales |

---

## Instalación local

### Prerrequisitos

- Node.js 18+
- Docker (recomendado para la base de datos local)

### 1. Base de datos

```bash
docker-compose up -d
```

> Sin Docker, configurar una instancia de PostgreSQL local y ajustar `DATABASE_URL` en el `.env`.

### 2. Backend

```bash
cd back
npm install
cp .env.example .env   # Completar las variables requeridas
npx prisma generate
npx prisma db push
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

### 3. Frontend

```bash
cd front
npm install
cp .env.example .env   # Completar las variables requeridas
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`back/.env`)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Clave secreta para firma de tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token |
| `PORT` | Puerto del servidor (default: 3000) |
| `CORS_ORIGIN` | Origen permitido para CORS |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `RESEND_API_KEY` | Clave para el servicio de email (Resend) |
| `NODE_ENV` | `development` o `production` |

### Frontend (`front/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API backend |

---

## Testing

```bash
# Desde /back
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:cov      # Reporte de cobertura
npm run test:e2e      # Tests end-to-end
```

Los tests cubren los módulos de autenticación, consultas, cursos, inscripciones, novedades, testimonios y materiales.

---

## Seguridad

- **Rate limiting global** con throttling configurable por endpoint.
- **Sanitización de entradas** en backend (`xss`) y frontend (`DOMPurify`) para prevenir ataques XSS.
- **Validación de variables de entorno** al inicio del servidor; el proceso no levanta si falta alguna variable crítica.
- **Headers HTTP seguros** mediante Helmet.
- **Autenticación JWT** con guards en todos los endpoints del panel admin.
- **Hash de contraseñas** con bcrypt.
- **CORS** restringido al origen de producción configurado.

---

## Licencia

Todos los derechos reservados © Natalia Luhmann.


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
