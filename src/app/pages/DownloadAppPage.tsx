import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import wordmark from '../../imports/flowfit-wordmark.png';

const APK_PATH = '/downloads/flowfit.apk';

export function DownloadAppPage() {
  const [apkReady, setApkReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(APK_PATH, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        const type = response.headers.get('content-type') ?? '';
        setApkReady(response.ok && !type.includes('text/html'));
      })
      .catch(() => setApkReady(false));
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-secondary/20 via-accent/10 to-background px-4 py-16">
      <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <img src={wordmark} alt="FlowFit" className="mx-auto mb-8 w-64 max-w-full object-contain" />
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Smartphone className="h-7 w-7" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">FlowFit para Android</h1>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Lleva tu seguimiento del ciclo y tus recomendaciones de movimiento contigo. Inicia sesión con la misma cuenta Google para sincronizar tus datos con la web.
        </p>
        {apkReady ? (
          <a href={APK_PATH} download="FlowFit.apk" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Download className="h-5 w-5" /> Descargar APK
          </a>
        ) : (
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <p className="font-semibold text-foreground">La descarga estará disponible próximamente</p>
            <p className="mt-2 text-sm text-muted-foreground">Cuando esté publicado, el APK firmado se colocará en <code>public/downloads/flowfit.apk</code>.</p>
          </div>
        )}
        <p className="mt-6 text-xs text-muted-foreground">Las estimaciones del ciclo son orientativas y no sustituyen atención médica.</p>
      </section>
    </main>
  );
}
