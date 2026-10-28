# FlowFit - Ecommerce de Productos de Higiene Femenina

![FlowFit Logo](./src/imports/imagen_2026-05-04_211142223.png)

Plataforma de ecommerce diseñada para mujeres activas, ofreciendo productos de higiene femenina optimizados para cada fase del ciclo menstrual.

---

## 🚀 Instalación y Configuración

### **Paso 1: Clonar/Descargar el Proyecto**

Si estás descargando el proyecto, descomprime el archivo en tu directorio deseado.

### **Paso 2: Instalar Dependencias**

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar dependencias del proyecto
pnpm install
```

### **Paso 3: Configurar Firebase**

#### **3.1. Crear Proyecto en Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: `flowfit` (o el que prefieras)
4. **Desactiva Google Analytics** (opcional, puedes activarlo después)
5. Haz clic en **"Crear proyecto"**

#### **3.2. Configurar Authentication**

1. En el menú lateral, ve a **"Authentication"**
2. Haz clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"**, habilita:
   - ✅ **Google** (click en Google → Habilitar → Guardar)
   
4. En **"Usuarios autorizados"** (opcional):
   - Puedes agregar dominios autorizados si lo necesitas

#### **3.3. Configurar Firestore Database**

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** (por ahora)
4. Elige la ubicación: **us-central** o la más cercana a ti
5. Haz clic en **"Habilitar"**

#### **3.4. Configurar Reglas de Seguridad**

En Firestore, ve a la pestaña **"Reglas"** y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para usuarios: solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcolecciones de usuario (carrito, favoritos)
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Regla para pedidos
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

Haz clic en **"Publicar"**

#### **3.5. Obtener Credenciales de Firebase**

1. En Firebase Console, ve a **⚙️ Configuración del proyecto** (esquina superior izquierda)
2. Baja hasta la sección **"Tus apps"**
3. Haz clic en el ícono **`</>`** (Web)
4. Nombre de la app: `FlowFit Web`
5. ✅ **NO** marques "Firebase Hosting" (por ahora)
6. Haz clic en **"Registrar app"**
7. **Copia las credenciales** que aparecen (firebaseConfig)

#### **3.6. Configurar Variables de Entorno**

1. En la raíz del proyecto, crea un archivo llamado `.env` (sin extensión):

```bash
# En la terminal:
touch .env
```

2. Abre el archivo `.env` y pega tus credenciales:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbC123...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ
```

**⚠️ IMPORTANTE:** Reemplaza con TUS credenciales de Firebase Console

3. **Actualiza** el archivo `src/firebase/firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### **Paso 4: Agregar Favicon (Logo en la Pestaña)**

Para que el logo de FlowFit aparezca en la pestaña del navegador:

1. Crea un archivo `public/favicon.ico` o usa la imagen directamente
2. Si usas Vite, crea `index.html` en la raíz del proyecto:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/src/imports/imagen_2026-05-04_211142223.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FlowFit - Tu bienestar en cada fase</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### **Paso 5: Ejecutar el Proyecto**

```bash
# Modo desarrollo
pnpm dev

# El servidor estará en: http://localhost:5173
```

### **Paso 6: Ver tus Datos en Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto **FlowFit**
3. **Firestore Database** → Verás las colecciones:
   - `users/` - Usuarios registrados
   - `users/{userId}/cart/` - Carrito de cada usuario
   - `users/{userId}/favorites/` - Favoritos de cada usuario
4. **Authentication** → Verás los usuarios que han iniciado sesión

---

## 📦 Compilar para Producción

```bash
# Generar build de producción
pnpm build

# Preview del build
pnpm preview
```

Los archivos compilados estarán en la carpeta `dist/`

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Routing:** React Router v7
- **Autenticación:** Firebase Authentication (Google OAuth)
- **Base de Datos:** Firestore
- **UI Components:** Radix UI
- **Iconos:** Lucide React
- **Notificaciones:** Sonner
- **Build Tool:** Vite

---

## 📂 Estructura del Proyecto

```
flowfit/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── ...
│   │   ├── pages/           # Páginas principales
│   │   │   ├── HomePage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   └── App.tsx          # Router principal
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── FavoritesContext.tsx
│   ├── firebase/
│   │   └── firebaseConfig.ts # Configuración de Firebase
│   ├── imports/             # Imágenes de productos
│   └── styles/              # Estilos globales
├── .env                     # Variables de entorno (NO SUBIR A GIT)
├── .env.example             # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## 🔐 Seguridad

**⚠️ NUNCA SUBAS TU ARCHIVO `.env` A GIT**

Agrega `.env` a tu `.gitignore`:

```
# .gitignore
.env
.env.local
```

---

## 🐛 Troubleshooting

### **Error: "Firebase: Error (auth/popup-blocked)"**
✅ **Solucionado:** Ahora usamos `signInWithRedirect` en lugar de popup

### **Error: "Missing or insufficient permissions"**
- Verifica las reglas de seguridad de Firestore
- Asegúrate de estar autenticado

### **Error: "Firebase config is invalid"**
- Revisa que las variables de entorno en `.env` sean correctas
- Reinicia el servidor de desarrollo: `Ctrl+C` y `pnpm dev`

### **No aparece el logo en la pestaña**
- Verifica que el archivo `index.html` esté en la raíz del proyecto
- Limpia el caché del navegador (`Ctrl+Shift+R`)

---

## 📧 Soporte

Para dudas o problemas:
- Revisa la documentación de [Firebase](https://firebase.google.com/docs)
- Revisa la documentación de [React](https://react.dev)

---

## 📄 Licencia

Este proyecto es privado y de uso personal.

---

**Hecho con ❤️ para mujeres activas que no se detienen durante su ciclo menstrual**
