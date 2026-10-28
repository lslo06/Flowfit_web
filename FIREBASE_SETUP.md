# Firebase para FlowFit Web y Android

Las dos aplicaciones deben conectarse al mismo proyecto de Firebase. En esta instalación ya están configuradas para el proyecto `flowfit-d8196`; no crees un segundo proyecto.

## Web

La web lee credenciales desde `.env` con estos nombres:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Las variables web son configuración pública del cliente Firebase. Nunca coloques aquí contraseñas de servicio, llaves privadas o secretos de pagos. En producción, agrega los mismos valores en las variables de entorno del proveedor donde publiques la web.

## Android y Google

Android no lee ese `.env`. Usa `app/google-services.json`, que debe pertenecer a la app Android registrada con identificador `com.fatima.flowfit` en el mismo proyecto. Habilita el proveedor Google en **Authentication > Sign-in method** y registra las huellas SHA-1/SHA-256 de firma Android. La guía con las huellas debug y los nombres de variables para firmar el APK está en `C:\Users\eduar\AndroidStudioProjects\FlowFit\CONFIGURACION.md`.

## Datos compartidos

Ambas apps usan Firebase Authentication y el mismo UID de Google. El perfil y ciclo se guardan en `users/{uid}`; ambas escriben el mapa `cycle` con inicio del último período, días de período y duración promedio. El carrito también se sincroniza ahí; los favoritos siguen disponibles solo en la web. Los pedidos de web y Android se consultan en `orders`; Android también sincroniza las sesiones completadas en `users/{uid}/workouts`. Las reglas limitan el acceso a la cuenta autenticada.

Desde esta carpeta, publica las reglas e índices que ya están preparados:

```powershell
firebase deploy --only firestore:rules,firestore:indexes
```

Para publicar solo la web después de compilar y copiar el APK firmado a `public/downloads/flowfit.apk`:

```powershell
pnpm build
firebase deploy --only hosting
```

La página `/descargar` muestra el botón cuando el APK está presente. No publiques una compilación debug. La compra registra una solicitud con estado de pago pendiente; aún requiere integrar un proveedor de pagos con validación en servidor antes de cobrar.

Antes de distribución pública faltan además revisar privacidad y tratamiento de datos de ciclo, probar Google Sign-In en dispositivo real y activar Firebase App Check.
