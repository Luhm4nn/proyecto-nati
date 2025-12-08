# ✅ Checklist de Deployment a Producción

## 📋 Pre-Deployment

### Backend

- [ ] **Variables de Entorno**
  ```env
  DATABASE_URL="postgresql://..." # URL de producción (Neon/Supabase/Railway)
  JWT_SECRET="cambiar-por-string-random-de-32-caracteres-minimo"
  JWT_EXPIRATION="30m"
  PORT=3000
  NODE_ENV=production
  CORS_ORIGIN="https://tu-dominio-frontend.com"
  ```

- [ ] **Base de Datos**
  - [ ] Crear base de datos PostgreSQL en producción (Neon/Supabase/Railway)
  - [ ] Copiar `DATABASE_URL` al `.env` de producción
  - [ ] Ejecutar: `npx prisma db push`
  - [ ] Ejecutar: `npx prisma generate`
  - [ ] Crear usuario admin: `npm run create:admin`

- [ ] **Secretos de Seguridad**
  - [ ] Cambiar `JWT_SECRET` por un valor random seguro
    ```bash
    # Generar secreto random:
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
  - [ ] Cambiar credenciales admin por defecto
  - [ ] Actualizar `CORS_ORIGIN` al dominio real del frontend

- [ ] **Build y Test**
  - [ ] Ejecutar: `npm run build`
  - [ ] Verificar que no hay errores de TypeScript
  - [ ] Probar login localmente
  - [ ] Verificar que los guards funcionan

### Frontend

- [ ] **Variables de Entorno**
  ```env
  VITE_API_URL=https://api.tu-dominio.com
  ```

- [ ] **Configuración**
  - [ ] Crear archivo `.env.production`
  - [ ] Actualizar `VITE_API_URL` a la URL del backend en producción
  - [ ] Verificar que no hay URLs hardcodeadas en el código

- [ ] **Build y Test**
  - [ ] Ejecutar: `npm run build`
  - [ ] Verificar carpeta `dist/` generada
  - [ ] Probar: `npm run preview`
  - [ ] Verificar que el login funciona

---

## 🚀 Deployment

### Opción 1: Railway (Backend + Database)

**Backend:**
1. [ ] Crear cuenta en [Railway.app](https://railway.app)
2. [ ] New Project → Deploy from GitHub
3. [ ] Seleccionar repositorio `proyecto-nati`
4. [ ] Configurar:
   - Root Directory: `/back`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
5. [ ] Agregar variables de entorno en Railway dashboard
6. [ ] Deploy

**Database:**
1. [ ] En Railway: Add Service → PostgreSQL
2. [ ] Copiar `DATABASE_URL` desde Railway
3. [ ] Agregar a variables de entorno del backend
4. [ ] Ejecutar migration desde Railway CLI o local:
   ```bash
   npx prisma db push
   ```

**Frontend:**
1. [ ] Usar Vercel/Netlify (ver Opción 2)

### Opción 2: Vercel (Frontend) + Neon (Database) + Railway (Backend)

**Database (Neon):**
1. [ ] Crear cuenta en [Neon.tech](https://neon.tech)
2. [ ] Create Project → PostgreSQL
3. [ ] Copiar connection string
4. [ ] Guardar para usar en backend

**Backend (Railway/Render/Fly.io):**
1. [ ] Deploy backend según Opción 1
2. [ ] Usar `DATABASE_URL` de Neon

**Frontend (Vercel):**
1. [ ] Crear cuenta en [Vercel.com](https://vercel.com)
2. [ ] Import Git Repository
3. [ ] Configurar:
   - Framework Preset: Vite
   - Root Directory: `/front`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. [ ] Environment Variables:
   - `VITE_API_URL`: URL del backend en Railway
5. [ ] Deploy

### Opción 3: Todo en un VPS (DigitalOcean/Linode)

**No recomendado para principiantes** - Requiere configuración manual de:
- Nginx
- PM2
- SSL/TLS
- PostgreSQL
- Firewall

---

## 🔒 Post-Deployment - Seguridad

- [ ] **SSL/TLS**
  - [ ] Verificar que frontend usa HTTPS
  - [ ] Verificar que backend usa HTTPS
  - [ ] Probar: https://www.ssllabs.com/ssltest/

- [ ] **CORS**
  - [ ] Verificar que solo el dominio del frontend puede acceder al backend
  - [ ] Probar request desde otro dominio (debe fallar)

- [ ] **Headers de Seguridad**
  - [ ] Probar: https://securityheaders.com/
  - [ ] Objetivo: Score A o superior

- [ ] **Credenciales**
  - [ ] Cambiar password admin
  - [ ] Nunca compartir `JWT_SECRET`
  - [ ] Nunca commitear archivos `.env`

---

## ✅ Testing Post-Deployment

### Funcionalidad
- [ ] Abrir landing page: `https://tu-dominio.com`
- [ ] Verificar que la imagen del logo carga
- [ ] Completar formulario de contacto
- [ ] Verificar que aparece mensaje de éxito
- [ ] Ir a login: `https://tu-dominio.com/login`
- [ ] Iniciar sesión con credenciales
- [ ] Verificar que redirige a `/admin`
- [ ] Ver lista de solicitudes
- [ ] Cambiar estado de una solicitud
- [ ] Eliminar una solicitud
- [ ] Cerrar sesión

### Seguridad
- [ ] Intentar acceder a `/admin` sin login (debe redirigir a `/login`)
- [ ] Intentar hacer 6 logins rápidos (debe bloquear después del 5to)
- [ ] Enviar 4 solicitudes en 1 hora (debe bloquear después de la 3ra)
- [ ] Enviar solicitud duplicada (debe rechazar)
- [ ] Verificar que el token expira después de 30 minutos
- [ ] Verificar que la sesión se cierra después de 30min de inactividad

---

## 📊 Monitoring (Opcional)

### Logs
- [ ] Configurar logging en Railway/Render
- [ ] Revisar logs de errores diariamente

### Uptime Monitoring
- [ ] Configurar UptimeRobot o similar
- [ ] Alertas por email si el sitio cae

### Error Tracking
- [ ] Instalar Sentry (opcional)
- [ ] Configurar alertas de errores

---

## 🆘 Troubleshooting

### Backend no inicia
```bash
# Verificar logs en Railway dashboard
# Común: falta npx prisma generate
```

### CORS Error
```bash
# Verificar CORS_ORIGIN en backend .env
# Debe ser exactamente el dominio del frontend (sin trailing slash)
```

### 401 Unauthorized
```bash
# Verificar que JWT_SECRET es el mismo en backend
# Hacer logout y volver a iniciar sesión
```

### Database connection error
```bash
# Verificar DATABASE_URL
# Verificar que la base de datos está activa
# Ejecutar: npx prisma db push
```

---

## 📝 Notas Importantes

1. **Nunca** commitear archivos `.env` al repositorio
2. **Siempre** usar HTTPS en producción
3. **Cambiar** el `JWT_SECRET` a un valor único y seguro
4. **Cambiar** las credenciales admin por defecto
5. **Hacer backup** de la base de datos regularmente
6. **Monitorear** logs de errores
7. **Actualizar** dependencias periódicamente (`npm audit`)

---

## ✅ Deployment Completado

Una vez completado este checklist:
- ✅ Backend deployado y accesible via HTTPS
- ✅ Frontend deployado y accesible via HTTPS
- ✅ Base de datos configurada y migrada
- ✅ Usuario admin creado
- ✅ Todas las funcionalidades probadas
- ✅ Seguridad verificada

**¡Tu aplicación está lista para ser usada en producción! 🎉**

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en el dashboard de deployment
2. Verificar variables de entorno
3. Consultar documentación de la plataforma
4. Abrir issue en GitHub (si es bug del código)

---

**Última actualización:** Diciembre 8, 2025
