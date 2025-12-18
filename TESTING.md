# 🧪 Guía de Testing - Proyecto Nati

## 📊 Resumen de Cobertura

### Backend (NestJS + Jest)

- ✅ Tests unitarios de servicios
- ✅ Tests e2e de API endpoints
- ✅ Tests de autenticación y seguridad
- 🎯 Objetivo: >70% cobertura

### Frontend (React + Vitest)

- ✅ Tests de componentes
- ✅ Tests de hooks personalizados
- ✅ Tests de integración de formularios
- 🎯 Objetivo: >60% cobertura

---

## 🚀 Comandos de Testing

### Backend

```bash
cd back

# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests con debug
npm run test:debug
```

### Frontend

```bash
cd front

# Ejecutar todos los tests
npm test

# Tests con UI interactiva
npm run test:ui

# Tests con cobertura
npm run test:coverage

# Tests en modo watch (por defecto con Vitest)
npm test
```

---

## 📝 Tests Implementados

### Backend

#### 1. **AuthService Tests** (`auth.service.spec.ts`)

- ✅ Login exitoso con credenciales válidas
- ✅ Rechazo de credenciales inválidas
- ✅ Generación correcta de JWT
- ✅ No exposición de contraseñas en respuestas
- ✅ Validación de usuarios

**Ejecutar solo estos tests:**

```bash
npm test -- auth.service.spec.ts
```

#### 2. **SolicitudesService Tests** (`solicitudes.service.spec.ts`)

- ✅ Creación de solicitudes válidas
- ✅ Sanitización XSS de inputs
- ✅ Prevención de duplicados en 24h
- ✅ Actualización de estados
- ✅ Eliminación de solicitudes
- ✅ Manejo de errores 404

**Ejecutar solo estos tests:**

```bash
npm test -- solicitudes.service.spec.ts
```

#### 3. **E2E Tests** (`app.e2e-spec.ts`)

- ✅ Autenticación completa (login/logout)
- ✅ CRUD de solicitudes
- ✅ Validación de permisos (JWT)
- ✅ Rate limiting
- ✅ Sanitización de datos

**Ejecutar tests e2e:**

```bash
npm run test:e2e
```

⚠️ **Importante:** Los tests e2e requieren una base de datos de testing. Configura `.env.test`:

```env
DATABASE_URL="postgresql://test:test@localhost:5432/test_db"
JWT_SECRET="test-secret-key-for-testing-only"
NODE_ENV="test"
```

---

### Frontend

#### 1. **Login Component Tests** (`Login.test.jsx`)

- ✅ Renderizado del formulario
- ✅ Validación de campos
- ✅ Login exitoso y redirección
- ✅ Manejo de errores de autenticación
- ✅ Estado de carga (loading)
- ✅ Almacenamiento de tokens

**Ejecutar:**

```bash
npm test -- Login.test
```

#### 2. **Contact Component Tests** (`Contact.test.jsx`)

- ✅ Envío de solicitudes
- ✅ Validación de formularios
- ✅ Sanitización XSS
- ✅ Manejo de duplicados
- ✅ Feedback visual (toasts)
- ✅ Reseteo de formulario

**Ejecutar:**

```bash
npm test -- Contact.test
```

#### 3. **useSessionTimeout Hook Tests** (`useSessionTimeout.test.js`)

- ✅ Timeout automático a 30 minutos
- ✅ Reset de timer con actividad
- ✅ Limpieza de listeners

**Ejecutar:**

```bash
npm test -- useSessionTimeout.test
```

---

## 🎯 Buenas Prácticas

### Backend

1. **Mocking de dependencias:**

```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
};
```

2. **Limpieza entre tests:**

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

3. **Tests asíncronos:**

```typescript
it("should do something async", async () => {
  await expect(service.method()).resolves.toBeDefined();
});
```

### Frontend

1. **Setup de usuario:**

```javascript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.type(input, "texto");
```

2. **Esperar cambios asíncronos:**

```javascript
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

3. **Mocking de fetch:**

```javascript
global.fetch = vi.fn();
global.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: "mock" }),
});
```

---

## 📈 Cobertura de Código

### Generar reportes de cobertura:

**Backend:**

```bash
cd back
npm run test:cov
# Ver reporte en: coverage/index.html
```

**Frontend:**

```bash
cd front
npm run test:coverage
# Ver reporte en: coverage/index.html
```

### Interpretar los reportes:

- **Statements:** % de líneas ejecutadas
- **Branches:** % de condiciones if/else cubiertas
- **Functions:** % de funciones ejecutadas
- **Lines:** % de líneas de código cubiertas

🎯 **Metas:**

- Backend: >70% en todos los criterios
- Frontend: >60% en todos los criterios

---

## 🐛 Debugging Tests

### Backend (Jest)

```bash
# Ejecutar con Node Inspector
npm run test:debug

# Luego abrir chrome://inspect
```

### Frontend (Vitest)

```bash
# UI interactiva con debugging visual
npm run test:ui

# O agregar debugger en el código
it('test', () => {
  debugger; // Se pausará aquí
  expect(true).toBe(true)
})
```

---

## 🔄 CI/CD Integration

Los tests se ejecutarán automáticamente en CI/CD:

```yaml
# En GitHub Actions (próximamente)
- run: npm test
- run: npm run test:e2e
```

---

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

---

## ✅ Checklist de Testing

Antes de hacer commit/merge:

- [ ] Todos los tests pasan (`npm test`)
- [ ] No hay tests ignorados innecesariamente (`.skip` o `.only`)
- [ ] Cobertura mínima alcanzada
- [ ] Tests e2e pasan
- [ ] No hay console.errors en los tests
- [ ] Tests son determinísticos (no fallan aleatoriamente)

---

## 🆘 Solución de Problemas

### "Cannot find module '@testing-library/react'"

```bash
cd front
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### "Tests e2e fallan con error de DB"

- Verifica que `.env.test` esté configurado
- Ejecuta `npx prisma db push` con DATABASE_URL de test

### "Timeout en tests"

```javascript
// Aumentar timeout
it("test lento", async () => {
  // ...
}, 10000); // 10 segundos
```

### "Tests de React no encuentran elementos"

```javascript
// Usa screen.debug() para ver el DOM
import { screen } from "@testing-library/react";
screen.debug(); // Imprime el HTML actual
```
