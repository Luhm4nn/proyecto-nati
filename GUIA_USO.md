# 📖 Guía de Uso - Panel de Administración

## 🎯 Para Natalia Luhmann

Esta guía explica cómo usar el sistema de gestión de consultas de clases de alemán.

---

## 🔐 Iniciar Sesión

1. Ir a: **[https://deutsch-fur-dich.vercel.app/login](https://deutsch-fur-dich.vercel.app/login)**
2. Ingresar credenciales:
   - **Email:** (La que configuraste en el servidor)
   - **Contraseña:** (La que configuraste en el servidor)
3. Click en "Iniciar Sesión"

**⚠️ Importante:** Por seguridad, la sesión se cerrará automáticamente después de 30 minutos de inactividad.

---

## 📋 Panel de Administración

### Vista Principal

Al iniciar sesión, verás:

- **Barra superior:** Tu nombre y botón de "Cerrar Sesión"
- **Filtros:** Botones para filtrar consultas por estado
- **Lista de consultas:** Todas las peticiones de clases

### Estados de Consultas

Cada consulta puede tener 3 estados:

1. **🟡 Pendiente** - Nueva consulta sin revisar
2. **🔵 Revisada** - Ya leíste la consulta
3. **🟢 Contactada** - Ya contactaste al alumno

---

## 📝 Gestionar Consultas

### Ver Consultas

**Todas las consultas:**

- Click en el botón "Todas" (muestra el número total)

**Filtrar por estado:**

- Click en "Pendientes" - solo las no revisadas
- Click en "Revisadas" - las que ya leíste
- Click en "Contactadas" - alumnos ya contactados

### Información de Cada Consulta

Cada tarjeta muestra:

- ✅ Nombre del interesado
- ✅ Email de contacto
- ✅ Teléfono (si lo proporcionó)
- ✅ Mensaje / consulta
- ✅ Fecha y hora de la consulta
- ✅ Estado actual

### Cambiar Estado

1. Ubicar la consulta
2. En el menú desplegable de la tarjeta, seleccionar el nuevo estado:
   - Pendiente
   - Revisada
   - Contactada
3. El cambio se guarda automáticamente

### Eliminar Consulta

⚠️ **Usar con cuidado - esta acción no se puede deshacer**

1. Ubicar la consulta a eliminar
2. Click en botón "Eliminar"
3. Confirmar en el mensaje que aparece
4. La consulta se borrará permanentemente

---

## 🛡️ Seguridad

### ✅ El sistema te protege de:

- Intentos de hackeo (máximo 5 intentos de login por minuto)
- Spam de consultas (máximo 3 por hora por persona)
- Consultas duplicadas (no se puede enviar la misma consulta 2 veces en 24h)
- Ataques XSS (el código malicioso se limpia automáticamente)
- Acceso no autorizado (todos los endpoints admin requieren login)

### 🔒 Buenas Prácticas

1. **Cerrar sesión** cuando termines de trabajar
2. **No compartir** tu contraseña
3. La sesión se cierra sola después de 30 minutos sin actividad
4. Si ves "No autorizado", vuelve a iniciar sesión

---

## 📱 Acceso desde Cualquier Dispositivo

El panel funciona en:

- 💻 Computadora (Windows, Mac, Linux)
- 📱 Celular (Android, iOS)
- 📟 Tablet

Solo necesitas un navegador moderno (Chrome, Firefox, Safari, Edge).

---

## 🆘 Problemas Comunes

### "Credenciales inválidas"

- Verifica que el email sea el correcto.
- Si olvidaste la contraseña, contacta al desarrollador para que ejecute el script de reinicio de credenciales.

### "No autorizado" / "401"

- Tu sesión expiró
- Vuelve a iniciar sesión
- La sesión dura 30 minutos desde la última actividad

### "Demasiadas consultas"

- Estás haciendo muchas acciones muy rápido
- Espera 1 minuto e intenta de nuevo

### La página se ve rara

- Refresca el navegador (F5 o Ctrl+R)
- Limpia el caché del navegador
- Prueba en otro navegador

---

## 📊 Flujo de Trabajo Recomendado

### Diariamente:

1. Iniciar sesión en el panel
2. Click en "Pendientes" para ver nuevas consultas
3. Leer cada consulta
4. Cambiar estado a "Revisada"
5. Contactar al alumno por email o teléfono
6. Cambiar estado a "Contactada"

### Semanalmente:

- Revisar consultas "Revisadas" que aún no fueron contactadas
- Limpiar consultas antiguas (opcional)

### Tips:

- 📧 Puedes copiar el email directamente desde la tarjeta
- 📞 Si hay teléfono, aparecerá en la información
- 📅 Las fechas están ordenadas (más recientes arriba)
- 🔍 Usa los filtros para organizarte mejor

---

## 🌐 URLs Importantes

- **Landing page:** https://deutsch-fur-dich.vercel.app
- **Panel admin:** https://deutsch-fur-dich.vercel.app/admin
- **Login:** https://deutsch-fur-dich.vercel.app/login

---

## 👨‍💻 Soporte Técnico

**Desarrollador:** Emiliano Luhmann

**Para reportar problemas:**

1. Describe qué estabas haciendo
2. Qué mensaje de error apareció (si hay)
3. En qué dispositivo/navegador estás
4. Captura de pantalla (si es posible)

**Reset de Contraseña (Solo Admin):**
Si necesitas resetear la contraseña del administrador, pide al desarrollador que ejecute:

```bash
npm run create:admin
```

(Con las nuevas credenciales configuradas en el servidor).

---

## 🎓 Recordatorios

- ✅ Tu contraseña está encriptada (nadie puede verla)
- ✅ El sistema registra la fecha de cada consulta
- ✅ Los datos están en una base de datos segura (PostgreSQL)
- ✅ Todo el tráfico debe ser HTTPS en producción
- ✅ El sistema previene spam y duplicados automáticamente

---

## 📈 Estadísticas

En la vista "Todas", el número entre paréntesis muestra:

- Total de consultas en el sistema

Ejemplo: **Todas (15)** significa que hay 15 consultas en total.

---

¡Listo! Ya puedes gestionar las consultas de tus alumnos de forma segura y organizada. 🎉
