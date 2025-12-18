# 🎨 Sistema de Toasts

Sistema de notificaciones ligero y profesional implementado con Context API.

## 🚀 Uso Rápido

### 1. Importar el hook

```jsx
import { useToast } from "../contexts/ToastContext";

function MiComponente() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  // ...
}
```

### 2. Mostrar notificaciones

```jsx
// Éxito (verde)
showSuccess("¡Operación exitosa!");

// Error (rojo)
showError("Algo salió mal");

// Información (azul)
showInfo("Proceso iniciado");

// Advertencia (amarillo)
showWarning("Cuidado con esto");
```

### 3. Duración personalizada

```jsx
// Por defecto: 4000ms (4 segundos)
showSuccess("Mensaje rápido");

// Duración personalizada
showSuccess("Mensaje largo", 8000); // 8 segundos

// Sin auto-cierre
showError("Requiere acción manual", 0);
```

---

## 📦 Tipos de Toast

### Success (Éxito)

```jsx
showSuccess("¡Solicitud enviada exitosamente!");
```

- Color: Verde (#10b981)
- Icono: ✓
- Uso: Confirmaciones, operaciones exitosas

### Error

```jsx
showError("Error al conectar con el servidor");
```

- Color: Rojo (#ef4444)
- Icono: ✕
- Uso: Errores, fallos, problemas

### Warning (Advertencia)

```jsx
showWarning("Ya has enviado una solicitud recientemente");
```

- Color: Amarillo (#f59e0b)
- Icono: ⚠
- Uso: Alertas, precauciones

### Info (Información)

```jsx
showInfo("Procesando tu solicitud...");
```

- Color: Azul (#3b82f6)
- Icono: ℹ
- Uso: Información general, estados

---

## 🎯 Ejemplos Reales

### Login exitoso

```jsx
const handleLogin = async () => {
  try {
    const response = await login(credentials);
    showSuccess(`¡Bienvenida, ${response.user.nombre}!`);
    navigate("/admin");
  } catch (error) {
    showError("Credenciales inválidas");
  }
};
```

### Formulario de contacto

```jsx
const handleSubmit = async (formData) => {
  try {
    await enviarSolicitud(formData);
    showSuccess("¡Solicitud enviada! Te contactaré pronto.", 5000);
    resetForm();
  } catch (error) {
    if (error.message.includes("duplicado")) {
      showWarning("Ya has enviado una solicitud recientemente", 6000);
    } else {
      showError("Error al enviar la solicitud");
    }
  }
};
```

### Operaciones CRUD

```jsx
const eliminarSolicitud = async (id) => {
  if (!confirm("¿Segura de eliminar?")) return;

  try {
    await deleteSolicitud(id);
    showSuccess("Solicitud eliminada correctamente");
    recargarLista();
  } catch (error) {
    showError("Error al eliminar la solicitud");
  }
};

const cambiarEstado = async (id, estado) => {
  try {
    await updateEstado(id, estado);
    showSuccess(`Estado actualizado a: ${estado}`);
  } catch (error) {
    showError("Error al actualizar el estado");
  }
};
```

---

## 🎨 Personalización

### Modificar duración global

Edita `ToastContext.jsx`:

```jsx
const showToast = useCallback((message, type = 'info', duration = 5000) => {
  // Ahora por defecto es 5 segundos
```

### Cambiar posición

Edita `Toast.css`:

```css
.toast-container {
  position: fixed;
  top: 20px; /* Cambiar a bottom: 20px para abajo */
  right: 20px; /* Cambiar a left: 20px para izquierda */
}
```

### Personalizar colores

En `Toast.css`:

```css
.toast-success {
  border-left: 4px solid #tu-color;
}

.toast-success .toast-icon {
  background: #tu-color-claro;
  color: #tu-color-oscuro;
}
```

---

## 🔧 API Completa

### Métodos disponibles

```typescript
interface ToastAPI {
  // Método genérico
  showToast(
    message: string,
    type?: "info" | "success" | "error" | "warning",
    duration?: number
  ): number;

  // Métodos específicos
  showSuccess(message: string, duration?: number): number;
  showError(message: string, duration?: number): number;
  showInfo(message: string, duration?: number): number;
  showWarning(message: string, duration?: number): number;

  // Cerrar manualmente
  removeToast(id: number): void;
}
```

### Cerrar toast manualmente

```jsx
const { showInfo, removeToast } = useToast();

const handleProcess = async () => {
  const toastId = showInfo("Procesando...", 0); // Sin auto-cierre

  try {
    await procesoLargo();
    removeToast(toastId);
    showSuccess("¡Proceso completado!");
  } catch (error) {
    removeToast(toastId);
    showError("Error en el proceso");
  }
};
```

---

## ♿ Accesibilidad

El sistema incluye características de accesibilidad:

```jsx
<div
  className="toast"
  role="alert"              // Rol ARIA
  aria-live="assertive"     // Anuncio inmediato
>
```

```jsx
<button
  className="toast-close"
  aria-label="Cerrar notificación"  // Label para lectores de pantalla
>
```

---

## 📱 Responsive

Adaptación automática en móviles:

- En desktop: 300-500px de ancho, esquina superior derecha
- En móvil: Ancho completo, márgenes reducidos

---

## 🎭 Animaciones

### Entrada

- Transición desde la derecha con fade-in
- Duración: 300ms
- Easing: cubic-bezier

### Salida

- Slide hacia la derecha con fade-out
- Duración: 300ms

### Stack

- Múltiples toasts se apilan verticalmente
- Espaciado: 12px entre toasts

---

## 🧪 Testing

Los toasts están integrados en los tests:

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import { ToastProvider } from "./contexts/ToastContext";

test("muestra toast de éxito", async () => {
  render(
    <ToastProvider>
      <MiComponente />
    </ToastProvider>
  );

  // ... acción que dispara toast

  await waitFor(() => {
    expect(screen.getByText(/éxito/i)).toBeInTheDocument();
  });
});
```

---

## 🔍 Troubleshooting

### "useToast must be used within ToastProvider"

Asegúrate de envolver tu app con `ToastProvider`:

```jsx
// En main.jsx
<ToastProvider>
  <App />
</ToastProvider>
```

### Toast no se ve

Verifica que `Toast.css` esté importado y el z-index sea alto (9999).

### Múltiples toasts se superponen

Es normal si aparecen muy rápido. Están diseñados para apilarse con 12px de separación.

---

## 📊 Ventajas vs Librerías

**vs react-toastify:**

- ✅ 90% más ligero (sin dependencias externas)
- ✅ Totalmente personalizable
- ✅ Integrado con Context API

**vs react-hot-toast:**

- ✅ Más simple y directo
- ✅ Mejor integración con tu proyecto
- ✅ Sin configuración extra

---

## 🎯 Mejores Prácticas

1. **Usa el tipo correcto:**

   - Success: operaciones completadas
   - Error: fallos reales
   - Warning: situaciones que requieren atención
   - Info: estados neutrales

2. **Mensajes claros:**

   ```jsx
   ❌ showError('Error')
   ✅ showError('No se pudo conectar con el servidor')
   ```

3. **Duración apropiada:**

   - Mensajes cortos: 3-4 segundos
   - Mensajes importantes: 5-7 segundos
   - Requiere acción: 0 (sin auto-cierre)

4. **No abusar:**

   - No mostrar toast para cada acción menor
   - Agrupar operaciones relacionadas

5. **Combinar con otras UIs:**

   ```jsx
   // Toast + navegación
   showSuccess("Guardado exitosamente");
   setTimeout(() => navigate("/lista"), 500);

   // Toast + reset de formulario
   showSuccess("Enviado correctamente");
   resetForm();
   ```
