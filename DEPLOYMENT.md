# ✅ Deployment con Vercel + Render + Neon

## 🎯 Stack de Producción
- **Frontend:** Vercel (gratis, auto-deploy)
- **Backend:** Render (gratis con limitaciones)
- **Database:** Neon PostgreSQL (ya lo tenés configurado)

---

## 📋 Pre-Deployment

### 1️⃣ Preparar Variables de Entorno

**Backend (.env en Render):**
```env
DATABASE_URL="tu-url-de-neon-postgresql"
JWT_SECRET="generar-string-random-32-caracteres"
PORT=3000
NODE_ENV=production
CORS_ORIGIN="https://tu-app.vercel.app"
```

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend (.env en Vercel):**
**Frontend (.env en Vercel):**
```env
VITE_API_URL=https://tu-backend.onrender.com
```
### 2️⃣ Preparar Base de Datos (Neon)
### 2️⃣ Preparar Base de Datos (Neon)

- [ ] Ir a tu proyecto en [Neon](https://console.neon.tech)
- [ ] Copiar el **Connection String** (pooled connection)
- [ ] Guardar para Render (formato: `postgresql://user:pass@host/db?sslmode=require`)
### 3️⃣ Test Local

**Backend:**
```bash
cd back
npm run build  # Verificar que compila sin errores
```

**Frontend:**
```bash
cd front
npm run build  # Verificar que compila sin errores
npm run preview  # Probar el build
```

---

## 🚀 Deployment Paso a Paso
## 🚀 Deployment Paso a Paso

### 🔵 PASO 1: Deploy Backend en Render

1. **Ir a [Render.com](https://render.com)**
   - Login con GitHub
   - Click "New +" → "Web Service"
   - Conectar repositorio `proyecto-nati`

2. **Configurar el Service**
   - **Name:** `proyecto-nati-backend`
   - **Root Directory:** `back`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `node dist/main.js`
   - **Instance Type:** Free

3. **Agregar Variables de Entorno**
   - Click "Advanced" → "Add Environment Variable"
   - Agregar:
     ```
     DATABASE_URL = tu-url-de-neon
     JWT_SECRET = tu-secreto-generado
     NODE_ENV = production
     CORS_ORIGIN = https://tu-app.vercel.app
     ```
   - (CORS_ORIGIN lo actualizás después de deployar en Vercel)

4. **Deploy**
   - Click "Create Web Service"
   - Render hace deploy automático (5-10 minutos la primera vez)
   - ⚠️ **Importante:** El servicio gratis "duerme" después de 15min sin uso
   - Copiar la URL pública: `https://proyecto-nati-backend.onrender.com`

5. **Ejecutar Migraciones**
   - En Render dashboard → Shell
   - Ejecutar: `npx prisma db push`
   - O desde local:
     ```bash
     DATABASE_URL="tu-url-de-neon" npx prisma db push
     ```
### 🟢 PASO 2: Deploy Frontend en Vercel

1. **Ir a [Vercel.com](https://vercel.com)**
   - Login con GitHub
   - Click "Add New" → "Project"
   - Import `proyecto-nati`

2. **Configurar el Proyecto**
   - **Framework Preset:** Vite
   - **Root Directory:** `front`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Environment Variables**
   - Click "Environment Variables"
   - Agregar:
     ```
     VITE_API_URL=https://proyecto-nati-production.up.railway.app
3. **Environment Variables**
   - Click "Environment Variables"
   - Agregar:
     ```
     VITE_API_URL=https://proyecto-nati-backend.onrender.com
     ```
   - (Usar la URL de Render del PASO 1)ti.vercel.app`

5. **Actualizar CORS en Railway**
   - Volver a Railway
   - Actualizar variable `CORS_ORIGIN` con la URL de Vercel
   - Railway redeploya automáticamente

5. **Actualizar CORS en Render**
   - Volver a Render
   - Actualizar variable `CORS_ORIGIN` con la URL de Vercel
   - Render redeploya automáticamente (2-3 min)
### Testear Backend
```bash
# Verificar que está vivo
curl https://tu-backend.up.railway.app

# Debería retornar error de CORS (es correcto)
```

### Testear Frontend
1. Abrir `https://tu-app.vercel.app`
2. Completar formulario de contacto → debería funcionar
3. Ir a `/login`
4. Login con credenciales
5. Ir a `/admin` → ver solicitudes

### Crear Usuario Admin
```bash
# Desde tu máquina local conectado a Neon
DATABASE_URL="tu-url-de-neon" npx ts-node back/scripts/create-admin.ts
```
### Crear Usuario Admin
```bash
# Desde tu máquina local conectado a Neon
DATABASE_URL="tu-url-de-neon" npx ts-node back/scripts/create-admin.ts
```

O desde Render Shell:
```bash
npm run create:admin
```
**Ya está configurado:**
- Push a GitHub → Railway redeploya backend automáticamente
- Push a GitHub → Vercel redeploya frontend automáticamente
## 🔄 Auto-Deploy

**Ya está configurado:**
- Push a GitHub → Render redeploya backend automáticamente
- Push a GitHub → Vercel redeploya frontend automáticamente

**⚠️ Limitación de Render Free:**
- El backend "duerme" después de 15 minutos sin uso
- La primera request después de dormir tarda ~30 segundos (cold start)
- Esto es normal y no afecta la funcionalidad
### Backend no inicia
```bash
## 🐛 Troubleshooting

### Backend no inicia
```bash
# Ver logs en Render dashboard → Logs tab
# Común: falta DATABASE_URL o JWT_SECRET
```

### CORS Error en Frontend
- Verificar `CORS_ORIGIN` en Render = URL exacta de Vercel
- NO incluir trailing slash: ❌ `https://app.vercel.app/` ✅ `https://app.vercel.app`

### Database connection failed
- Verificar `DATABASE_URL` en Render
- Debe incluir `?sslmode=require` al final
- Verificar que Neon está activo
### 401 Unauthorized después de login
- Token expirado, hacer logout y volver a loguear
- O cambió el `JWT_SECRET` en Render
- O el backend estaba dormido y perdió la sesión (refrescar)settings
- Debe ser la URL de Render (sin trailing slash)

## 💰 Costos

**Total: $0/mes** (100% gratis)

- **Vercel:** Gratis (100GB bandwidth/mes, unlimited deployments)
- **Render:** Gratis con limitaciones:
  - 750 horas/mes de uso
  - Backend "duerme" después de 15min sin uso
  - Cold starts (~30-60 segundos al despertar)
  - Suficiente para un proyecto personal
- **Neon:** Gratis (3GB storage, 100 horas compute/mes)

**Si querés evitar el "sleep":**
- Render Starter: $7/mes (backend siempre activo)
## 🎯 URLs Finales

Después del deployment tendrás:

```
Frontend:  https://proyecto-nati.vercel.app
Backend:   https://proyecto-nati-backend.onrender.com  
Database:  Neon (conexión directa desde Render)
```

**Compartir con Natalia:** Solo la URL del frontend ✅
## 🎯 URLs Finales

Después del deployment tendrás:

```
Frontend:  https://proyecto-nati.vercel.app
Backend:   https://proyecto-nati-production.up.railway.app  
Database:  Neon (conexión directa desde Railway)
```

### En Render:
1. Settings → Custom Domain
2. Agregar: `api.natiluhmann.com`
3. Configurar CNAME según instrucciones
4. Actualizar `CORS_ORIGIN` en Render con el nuevo dominio del frontend
## 📱 Configurar Dominio Personalizado (Opcional)

## ✅ Checklist Final

- [ ] Backend deployado en Render
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Base de datos Neon conectada
- [ ] Usuario admin creado
- [ ] CORS actualizado correctamente
- [ ] Login funciona
- [ ] Formulario de contacto funciona
- [ ] Panel admin carga solicitudes
- [ ] Rate limiting funcionando (probar 6 logins rápidos)
- [ ] Probar cold start (esperar 20min, refrescar y esperar)

**¡Listo para usar! 🎉**
- [ ] Backend deployado en Railway
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Base de datos Neon conectada
- [ ] Usuario admin creado
- [ ] CORS actualizado correctamente
- [ ] Login funciona
- [ ] Formulario de contacto funciona
- [ ] Panel admin carga solicitudes
- [ ] Rate limiting funcionando (probar 6 logins rápidos)

**¡Listo para usar! 🎉**
