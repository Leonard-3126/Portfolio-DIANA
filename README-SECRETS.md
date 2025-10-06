# Cómo añadir la clave de servicio (service account) a GitHub Actions

Este proyecto requiere una clave de servicio de Firebase/Google Cloud para inicializar `firebase-admin` en entornos de CI/CD.

Opciones válidas para el secret:
- `FIREBASE_SERVICE_ACCOUNT_JSON`: pega el JSON entero del archivo descargado (recomendado y simple).
- `FIREBASE_SERVICE_ACCOUNT_BASE64`: pega la representación base64 del JSON (recomendado si prefieres evitar problemas con saltos de línea).

Pasos para crear el secret (opción JSON crudo):
1. Abre el fichero JSON en tu máquina (ej: `C:\keys\portfolio-...`) y copia todo su contenido.
2. En GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Secret: pega todo el JSON
   - Click "Add secret"

Pasos para crear el secret (opción base64):
1. En PowerShell ejecuta:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\keys\portfolio-7ade3-16a9f2d88955')) | clip
   ```
   Esto copia la cadena base64 al portapapeles.
2. En GitHub: crea un secret llamado `FIREBASE_SERVICE_ACCOUNT_BASE64` y pega la cadena.

Workflow
- El workflow `/.github/workflows/deploy.yml` soporta ambos secretos: primero busca `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON crudo); si no existe, busca `FIREBASE_SERVICE_ACCOUNT_BASE64` y lo decodifica.
- Durante la ejecución la action genera `serviceAccountKey.json` en el workspace y deja disponible la ruta para la app.

Notas de seguridad
- No subas el JSON al repositorio.
- Si la clave fue expuesta, revócala inmediatamente en Google Cloud Console y genera una nueva.
- Mantén `serviceAccountKey.json` en `.gitignore`.

Ejemplo local
```powershell
$env:FIREBASE_SERVICE_ACCOUNT_PATH = 'C:\keys\portfolio-7ade3-16a9f2d88955'
node server.js
# en otra terminal
Invoke-RestMethod -Uri http://localhost:3000/firebase/status
```

Si necesitas que haga la configuración (actualizar workflow, crear README en el repo, etc.) puedo hacerlo por ti.

## Rotar / revocar la API key expuesta

Si recibiste una alerta (o viste la API key en el repo), haz lo siguiente inmediatamente:

1. Ve a Google Cloud Console → APIs & Services → Credentials.
2. Localiza la API key expuesta y elimínala (Delete). Esto la revocará.
3. Crea una nueva API key (Create credentials → API key) y restringe su uso:
   - Application restrictions: HTTP referrers (web sites) — añade la URL de tu dominio (ej: `https://tu-dominio.com/*`).
   - API restrictions: selecciona las APIs que puede usar (por ejemplo: Firestore, Cloud Storage, etc.).
4. Actualiza tu entorno de producción / hosting para usar la nueva API key (no la guardes en el repo).

## Buenas prácticas adicionales
- Para el frontend, las API keys de Firebase son públicas por diseño, pero restringirlas por referrer es esencial.
- Para operaciones administrativas o server-side usa service accounts y secretos seguros (ya implementado en este repo).
