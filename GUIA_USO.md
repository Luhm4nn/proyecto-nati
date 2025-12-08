# 📖 Guía de Uso - Panel de Administración

## 🎯 Para Natalia Luhmann

Esta guía explica cómo usar el sistema de gestión de solicitudes de clases de alemán.

---

## 🔐 Iniciar Sesión

1. Ir a: **https://tu-sitio.com/login** (o http://localhost:5173/login en desarrollo)
2. Ingresar credenciales:
   - **Email:** natalia@luhmann.com
   - **Contraseña:** natalia2024
3. Click en "Iniciar Sesión"

**⚠️ Importante:** Por seguridad, la sesión se cerrará automáticamente después de 30 minutos de inactividad.

---

## 📋 Panel de Administración

### Vista Principal

Al iniciar sesión, verás:
- **Barra superior:** Tu nombre y botón de "Cerrar Sesión"
- **Filtros:** Botones para filtrar solicitudes por estado
- **Lista de solicitudes:** Todas las peticiones de clases

### Estados de Solicitudes

Cada solicitud puede tener 3 estados:

1. **🟡 Pendiente** - Nueva solicitud sin revisar
2. **🔵 Revisada** - Ya leíste la solicitud
3. **🟢 Contactada** - Ya contactaste al alumno

---

## 📝 Gestionar Solicitudes

### Ver Solicitudes

**Todas las solicitudes:**
- Click en el botón "Todas" (muestra el número total)

**Filtrar por estado:**
- Click en "Pendientes" - solo las no revisadas
- Click en "Revisadas" - las que ya leíste
- Click en "Contactadas" - alumnos ya contactados

### Información de Cada Solicitud

Cada tarjeta muestra:
- ✅ Nombre del interesado
- ✅ Email de contacto
- ✅ Teléfono (si lo proporcionó)
- ✅ Mensaje / consulta
- ✅ Fecha y hora de la solicitud
- ✅ Estado actual

### Cambiar Estado

1. Ubicar la solicitud
2. En el menú desplegable de la tarjeta, seleccionar el nuevo estado:
   - Pendiente
   - Revisada
   - Contactada
3. El cambio se guarda automáticamente

### Eliminar Solicitud

⚠️ **Usar con cuidado - esta acción no se puede deshacer**

1. Ubicar la solicitud a eliminar
2. Click en botón "Eliminar"
3. Confirmar en el mensaje que aparece
4. La solicitud se borrará permanentemente

---

## 🛡️ Seguridad

### ✅ El sistema te protege de:
- Intentos de hackeo (máximo 5 intentos de login por minuto)
- Spam de solicitudes (máximo 3 por hora por persona)
- Solicitudes duplicadas (no se puede enviar la misma solicitud 2 veces en 24h)
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
- Verifica que el email sea: `natalia@luhmann.com`
- Verifica que la contraseña sea correcta
- Si olvidaste la contraseña, contacta al desarrollador

### "No autorizado" / "401"
- Tu sesión expiró
- Vuelve a iniciar sesión
- La sesión dura 30 minutos desde la última actividad

### "Demasiadas solicitudes"
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
2. Click en "Pendientes" para ver nuevas solicitudes
3. Leer cada solicitud
4. Cambiar estado a "Revisada"
5. Contactar al alumno por email o teléfono
6. Cambiar estado a "Contactada"

### Semanalmente:
- Revisar solicitudes "Revisadas" que aún no fueron contactadas
- Limpiar solicitudes antiguas (opcional)

### Tips:
- 📧 Puedes copiar el email directamente desde la tarjeta
- 📞 Si hay teléfono, aparecerá en la información
- 📅 Las fechas están ordenadas (más recientes arriba)
- 🔍 Usa los filtros para organizarte mejor

---

## 🌐 URLs Importantes

### Desarrollo (local)
- **Landing page:** http://localhost:5173
- **Panel admin:** http://localhost:5173/admin
- **Login:** http://localhost:5173/login

### Producción (cuando esté deployado)
- **Landing page:** https://tu-dominio.com
- **Panel admin:** https://tu-dominio.com/admin
- **Login:** https://tu-dominio.com/login

---

## 👨‍💻 Soporte Técnico

**Desarrollador:** Emiliano Luhmann

**Para reportar problemas:**
1. Describe qué estabas haciendo
2. Qué mensaje de error apareció (si hay)
3. En qué dispositivo/navegador estás
4. Captura de pantalla (si es posible)

---

## 🎓 Recordatorios

- ✅ Tu contraseña está encriptada (nadie puede verla)
- ✅ El sistema registra la fecha de cada solicitud
- ✅ Los datos están en una base de datos segura (PostgreSQL)
- ✅ Todo el tráfico debe ser HTTPS en producción
- ✅ El sistema previene spam y duplicados automáticamente

---

## 📈 Estadísticas

En la vista "Todas", el número entre paréntesis muestra:
- Total de solicitudes en el sistema

Ejemplo: **Todas (15)** significa que hay 15 solicitudes en total.

---

¡Listo! Ya puedes gestionar las solicitudes de tus alumnos de forma segura y organizada. 🎉
