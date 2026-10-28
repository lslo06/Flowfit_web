# 📝 Comandos para Terminal - FlowFit

## 🚀 Instalación Inicial (Solo una vez)

```bash
# 1. Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm

# 2. Navegar a la carpeta del proyecto
cd flowfit

# 3. Instalar todas las dependencias
pnpm install
```

---

## ⚙️ Configuración de Firebase (Solo una vez)

```bash
# 1. Crear archivo .env
touch .env

# 2. Abrir .env con tu editor favorito
nano .env
# o
code .env
# o
notepad .env  # En Windows

# 3. Pegar tus credenciales de Firebase (ver README.md)
# Presiona Ctrl+X, luego Y, luego Enter para guardar (si usas nano)
```

---

## 🏃 Ejecutar el Proyecto

### **Modo Desarrollo** (recomendado para trabajar)

```bash
pnpm dev
```

- **URL:** http://localhost:5173
- **Hot Reload:** Los cambios se ven automáticamente
- **Presiona** `Ctrl+C` para detener el servidor

### **Modo Preview** (ver el build compilado)

```bash
# 1. Compilar el proyecto
pnpm build

# 2. Ver el preview
pnpm preview
```

---

## 📦 Comandos de pnpm

```bash
# Instalar una nueva dependencia
pnpm add nombre-paquete

# Instalar dependencia de desarrollo
pnpm add -D nombre-paquete

# Desinstalar dependencia
pnpm remove nombre-paquete

# Actualizar dependencias
pnpm update

# Limpiar cache
pnpm store prune
```

---

## 🔥 Firebase CLI (Opcional - para deploy)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login a Firebase
firebase login

# 3. Inicializar Firebase en el proyecto
firebase init

# 4. Deploy a Firebase Hosting
firebase deploy
```

---

## 🐛 Solución de Problemas

### **Limpiar y reinstalar todo**

```bash
# 1. Eliminar node_modules y cache
rm -rf node_modules .pnpm-store pnpm-lock.yaml

# 2. Reinstalar todo
pnpm install
```

### **Error de permisos en Windows**

```powershell
# Ejecutar PowerShell como Administrador
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Puerto 5173 en uso**

```bash
# Matar el proceso en el puerto 5173
# En Linux/Mac:
lsof -ti:5173 | xargs kill -9

# En Windows (CMD):
netstat -ano | findstr :5173
taskkill /PID <numero-pid> /F
```

---

## 📁 Comandos Git (Control de versiones)

```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit"

# Crear repositorio remoto en GitHub y conectar
git remote add origin https://github.com/tu-usuario/flowfit.git
git branch -M main
git push -u origin main
```

---

## 🌐 Desplegar en Vercel (Gratis)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login a Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

**⚠️ Recuerda:** Debes agregar las variables de entorno en el dashboard de Vercel:
- Settings → Environment Variables → Agregar cada `VITE_FIREBASE_*`

---

## 🌐 Desplegar en Netlify (Gratis)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login a Netlify
netlify login

# 3. Inicializar
netlify init

# 4. Deploy
netlify deploy --prod
```

**⚠️ Recuerda:** Debes agregar las variables de entorno en el dashboard de Netlify:
- Site settings → Environment variables → Agregar cada `VITE_FIREBASE_*`

---

## 📊 Ver logs de Firebase

```bash
# Ver logs en tiempo real
firebase functions:log

# Ver logs de Firestore
# (Usar Firebase Console en el navegador)
```

---

## 🎨 Desarrollo

```bash
# Ver estructura del proyecto
tree -L 3 -I 'node_modules'

# Buscar en archivos
grep -r "texto-a-buscar" src/

# Contar líneas de código
find src -name '*.tsx' -o -name '*.ts' | xargs wc -l
```

---

## ✅ Checklist antes de Deploy

```bash
# 1. Verificar que no hay errores
pnpm build

# 2. Verificar variables de entorno
cat .env

# 3. Probar el build localmente
pnpm preview

# 4. Commit de cambios
git add .
git commit -m "Ready for deploy"
git push

# 5. Deploy
vercel --prod
# o
netlify deploy --prod
```

---

## 📚 Comandos Útiles del Sistema

### **Linux/Mac**

```bash
# Ver procesos
ps aux | grep node

# Ver uso de memoria
free -h

# Ver espacio en disco
df -h

# Navegar carpetas
cd ..          # Subir un nivel
cd nombre/     # Entrar a carpeta
ls -la         # Listar archivos
pwd            # Ver carpeta actual
```

### **Windows (CMD)**

```cmd
# Ver procesos
tasklist | findstr node

# Ver directorio actual
cd

# Listar archivos
dir

# Limpiar pantalla
cls
```

---

**¡Listo! Con estos comandos puedes trabajar en FlowFit desde cualquier computadora** 🚀

## Publicar FlowFit Android en la web

1. Configura el keystore de firma release con las variables indicadas en `C:\Users\eduar\AndroidStudioProjects\FlowFit\CONFIGURACION.md`.
2. Desde PowerShell, dentro de Android Studio/FlowFit, ejecuta:

```powershell
$env:FLOWFIT_WEB_PROJECT_DIR = 'C:\Proyectos\FlowFit'
.\gradlew.bat copyReleaseApkToWebsite
```

3. En esta carpeta web compila y publica Hosting:

```powershell
pnpm build
firebase deploy --only hosting
```

El archivo firmado se colocará en `public/downloads/flowfit.apk`. La ruta `/descargar` activa su enlace al detectarlo.
