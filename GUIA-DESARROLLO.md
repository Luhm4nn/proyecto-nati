# Guía de Desarrollo — Alemán Para Vos

## Tabla de contenidos

- [Configuración del entorno](#configuración-del-entorno)
- [Comandos diarios](#comandos-diarios)
- [Testing](#testing)
- [Base de datos](#base-de-datos)
- [Sistema de notificaciones (Toasts)](#sistema-de-notificaciones-toasts)
- [Workflow Git](#workflow-git)
- [CI/CD](#cicd)
- [Deployment](#deployment)

---

## Configuración del entorno

### Primera vez

```bash
# 1. Clonar repositorio
git clone <url-del-repo>
cd aleman-para-vos

# 2. Backend
cd back
npm install
cp .env.example .env     # Completar variables antes de continuar
npx prisma generate
npx prisma db push

# 3. Frontend
cd ../front
npm install
cp .env.example .env     # Completar VITE_API_URL
```

> Consultar el README para el detalle completo de variables de entorno requeridas.

---

## Comandos diarios

**Backend (terminal 1):**

```bash
cd back
npm run start:dev       # Servidor en http://localhost:3000
```

**Frontend (terminal 2):**

```bash
cd front
npm run dev             # App en http://localhost:5173
```

**Referencia completa de scripts:**

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Servidor backend con hot-reload |
| `npm run build` | Compilar TypeScript para producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run test:cov` | Tests con reporte de cobertura |
| `npm run test:e2e` | Tests end-to-end |
| `npm run lint` | Verificar estilo de código |
| `npx prisma studio` | Interfaz visual de la base de datos |
| `npx prisma db push` | Sincronizar esquema con la BD |
| `npx prisma migrate dev` | Crear y aplicar nueva migración |

---

## Testing

### Backend (Jest)

**Ejecutar tests:**

```bash
cd back
npm test                 # Todos los tests
npm run test:watch       # Modo watch
npm run test:cov         # Con reporte de cobertura
npm run test:e2e         # Tests end-to-end
```

**Estructura:**

```
back/
├── src/
│   ├── auth/auth.service.spec.ts
│   ├── consultas/consultas.service.spec.ts
│   ├── cursos/cursos.service.spec.ts
│   ├── inscripciones/inscripciones.service.spec.ts
│   └── prisma/prisma.service.spec.ts
└── test/
    └── app.e2e-spec.ts
```

**Cobertura actual:**

| Módulo | Aspectos cubiertos |
|---|---|
| Auth | Login, credenciales inválidas, JWT, rate limiting |
| Consultas | CRUD, paginación, filtros, validación de duplicados, sanitización XSS |
| Cursos | CRUD, dictados, cupos, precios nacionales e internacionales |
| Inscripciones | Creación, confirmación, validación de cupos, adjuntos Cloudinary |
| Materiales / Novedades / Testimonios | CRUDs completos, toggle activo, sanitización |
| E2E | Flujos críticos de autenticación y endpoints protegidos |

**Scaffolding de nuevo test:**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MiServicio } from './mi.service';

describe('MiServicio', () => {
  let service: MiServicio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiServicio],
    }).compile();
    service = module.get<MiServicio>(MiServicio);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend (Vitest + Testing Library)

Las dependencias ya están instaladas (`vitest`, `@testing-library/react`, `jsdom`). Para activar:

1. Agregar configuración en `vite.config.js`:
   ```js
   test: { environment: 'jsdom', globals: true }
   ```
2. Crear tests en `src/components/**/*.test.jsx`.

---

## Base de datos

### Flujo de trabajo con Prisma

```bash
# Ver estado del esquema vs. migaciones
npx prisma migrate status

# Crear nueva migración (cambios en schema.prisma)
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
npx prisma migrate deploy

# Interfaz visual de los datos
npx prisma studio
```

### Modelos principales

| Modelo | Tabla | Relaciones |
|---|---|---|
| `Curso` | `cursos` | Tiene muchos `DictadoCurso` |
| `DictadoCurso` | `dictados_curso` | Pertenece a `Curso`, tiene muchas `Inscripcion` |
| `Inscripcion` | `inscripciones` | Pertenece a `DictadoCurso` |
| `Consulta` | `consultas` | Independiente |
| `Novedad` | `novedades` | Independiente, imagen en Cloudinary |
| `Material` | `materiales` | Independiente, archivo en Cloudinary |
| `Testimonio` | `testimonios` | Independiente, toggle `activo` |
| `DatosTransferencia` | `datos_transferencia` | Independiente, tipo `nacional`/`internacional` |

---

## Sistema de notificaciones (Toasts)

Implementación propia sin librerías externas.

**Archivos:**

| Archivo | Responsabilidad |
|---|---|
| `front/src/contexts/ToastContext.jsx` | Estado global y lógica |
| `front/src/components/shared/Toast.jsx` | Componente visual |

**Uso:**

```jsx
import { useToast } from '../contexts/ToastContext';

function MiComponente() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // Uso básico
  showSuccess('Operación completada');
  showError('Algo salió mal');
  showWarning('Esta acción no se puede deshacer', 6000); // duración en ms
  showInfo('Información importante');

  // Toast permanente (sin cierre automático)
  showError('Error crítico', 0);
}
```

| Tipo | Color | Cuándo usarlo |
|---|---|---|
| `success` | Verde | Operación exitosa |
| `error` | Rojo | Error o fallo |
| `warning` | Amarillo | Advertencia, acción irreversible |
| `info` | Azul | Información neutral |

---

## Workflow Git

### Estructura de branches

```
main        →  Producción (deploy automático)
develop     →  Integración / pre-producción
feat/*      →  Nuevas funcionalidades
fix/*       →  Corrección de bugs
```

### Flujo estándar

```bash
# Partiendo desde develop actualizado
git checkout develop && git pull origin develop

# Crear rama de trabajo
git checkout -b feat/nombre-descriptivo

# Trabajo incremental con commits convencionales
git add .
git commit -m "feat: descripción concisa del cambio"

# Publicar y abrir Pull Request a develop
git push origin feat/nombre-descriptivo
```

### Convención de commits

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Documentación |
| `refactor:` | Refactorización sin cambio de comportamiento |
| `test:` | Tests |
| `chore:` | Mantenimiento, dependencias |

---

## CI/CD

El pipeline está definido en `.github/workflows/ci-cd.yml` y se activa automáticamente.

| Evento | Qué ejecuta |
|---|---|
| Pull Request a `main` o `develop` | Valida compilación de backend y frontend |
| Push a `main` | Deploy automático a Vercel (frontend) y Render (backend) |

**Verificar estado:** pestaña Actions en GitHub. Si el pipeline falla, el merge queda bloqueado hasta corregir los errores.

---

## Deployment

| Capa | Plataforma | Trigger |
|---|---|---|
| Frontend | Vercel | Push a `main` (automático vía CI/CD) |
| Backend | Render | Push a `main` (automático vía CI/CD) |
| Base de datos | PostgreSQL cloud | Manual (vía `prisma migrate deploy`) |

**Deploy manual de emergencia:**

- Vercel: Dashboard → proyecto → "Redeploy"
- Render: Dashboard → servicio → "Manual Deploy"

Las migraciones de base de datos en producción deben ejecutarse explícitamente antes de deployar cambios de esquema:

```bash
# Con la DATABASE_URL de producción configurada
npx prisma migrate deploy
```

