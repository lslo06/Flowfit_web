import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

type CycleRecord = {
  lastPeriodStart: string;
  periodDays: number;
  cycleLength: number;
};

const EMPTY_CYCLE: CycleRecord = { lastPeriodStart: '', periodDays: 5, cycleLength: 28 };

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CycleInfo() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<CycleRecord>(EMPTY_CYCLE);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setCycle(EMPTY_CYCLE);
      return;
    }
    const reference = doc(db, 'users', user.uid);
    return onSnapshot(reference, (snapshot) => {
      const stored = snapshot.data()?.cycle as Partial<CycleRecord> | undefined;
      if (!stored) {
        setCycle(EMPTY_CYCLE);
        return;
      }
      setCycle({
        lastPeriodStart: typeof stored.lastPeriodStart === 'string' ? stored.lastPeriodStart : '',
        periodDays: typeof stored.periodDays === 'number' && Number.isFinite(stored.periodDays) ? stored.periodDays : 5,
        cycleLength: typeof stored.cycleLength === 'number' && Number.isFinite(stored.cycleLength) ? stored.cycleLength : 28,
      });
    }, (error) => {
      console.error('No se pudo sincronizar el ciclo:', error);
      toast.error('No se pudo cargar tu información del ciclo.');
    });
  }, [user?.uid]);

  const estimate = useMemo(() => {
    if (!cycle.lastPeriodStart) return null;
    const start = new Date(`${cycle.lastPeriodStart}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
    if (days < 0 || !Number.isFinite(days)) return null;
    const day = (days % cycle.cycleLength) + 1;
    const ovulationDay = Math.max(cycle.cycleLength - 14, cycle.periodDays + 1);
    const phaseIndex = day <= cycle.periodDays ? 0 : day < Math.max(cycle.periodDays + 1, ovulationDay - 5) ? 1 : day <= ovulationDay + 1 ? 2 : 3;
    return { day, phaseIndex, ovulationDay };
  }, [cycle]);

  const phases = [
    { phase: 'Menstrual', days: `1–${cycle.periodDays}`, recommendation: 'Prioriza el descanso y registra cómo te sientes.', color: 'bg-primary/20 border-primary' },
    { phase: 'Folicular', days: `${cycle.periodDays + 1}–${Math.max(cycle.periodDays + 1, (estimate?.ovulationDay ?? cycle.cycleLength - 14) - 5)}`, recommendation: 'Ajusta el movimiento a tu energía y comodidad.', color: 'bg-secondary/20 border-secondary' },
    { phase: 'Ovulación estimada', days: `${estimate?.ovulationDay ?? cycle.cycleLength - 14}–${(estimate?.ovulationDay ?? cycle.cycleLength - 14) + 1}`, recommendation: 'La ventana es una estimación, no una predicción médica.', color: 'bg-accent/20 border-accent' },
    { phase: 'Lútea', days: `${(estimate?.ovulationDay ?? cycle.cycleLength - 14) + 2}–${cycle.cycleLength}`, recommendation: 'Mantén hábitos que se adapten a cómo te sientes.', color: 'bg-muted border-muted-foreground/30' },
  ];

  const saveCycle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!cycle.lastPeriodStart || cycle.lastPeriodStart > localDateString(new Date())) {
      toast.error('Selecciona una fecha pasada o de hoy para el inicio del período.');
      return;
    }
    if (cycle.periodDays < 1 || cycle.periodDays > 10 || cycle.cycleLength < 21 || cycle.cycleLength > 45) {
      toast.error('Usa una duración de período de 1–10 días y ciclo de 21–45 días.');
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        cycle: {
          lastPeriodStart: cycle.lastPeriodStart,
          periodDays: cycle.periodDays,
          cycleLength: cycle.cycleLength,
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Ciclo sincronizado con FlowFit Android.');
    } catch (error) {
      console.error('No se pudo guardar el ciclo:', error);
      toast.error('No se pudo guardar. Revisa tu conexión y las reglas de Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const openTracker = () => {
    if (!user) navigate('/login');
    else document.getElementById('cycle-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const phaseNames = ['Menstrual', 'Folicular', 'Ovulación', 'Lútea'];
  return (
    <section className="py-16" aria-labelledby="cycle-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-10">
            <h2 id="cycle-title" className="text-3xl font-bold text-foreground mb-3">Tu ciclo, sincronizado</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guarda el inicio de tu último período en tu cuenta y consulta la misma información en FlowFit Android.
            </p>
          </div>

          {authLoading ? <p className="text-center text-muted-foreground">Cargando tu cuenta…</p> : user ? (
            <div className="max-w-3xl mx-auto mb-10 rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm text-muted-foreground">{estimate ? `Día ${estimate.day} de ${cycle.cycleLength}` : 'Aún no registras un período'}</p>
                  <h3 className="text-xl font-semibold text-foreground">{estimate ? `Fase estimada: ${phaseNames[estimate.phaseIndex]}` : 'Configura tu ciclo'}</h3>
                </div>
                {estimate && <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">Próxima fase: estimación</span>}
              </div>
              <form id="cycle-editor" onSubmit={saveCycle} className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-foreground">Inicio del último período
                  <input type="date" max={localDateString(new Date())} value={cycle.lastPeriodStart} onChange={(e) => setCycle((current) => ({ ...current, lastPeriodStart: e.target.value }))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" required />
                </label>
                <label className="text-sm font-medium text-foreground">Días de período
                  <input type="number" min="1" max="10" value={cycle.periodDays} onChange={(e) => setCycle((current) => ({ ...current, periodDays: Number(e.target.value) }))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" required />
                </label>
                <label className="text-sm font-medium text-foreground">Ciclo promedio
                  <input type="number" min="21" max="45" value={cycle.cycleLength} onChange={(e) => setCycle((current) => ({ ...current, cycleLength: Number(e.target.value) }))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" required />
                </label>
                <button type="submit" disabled={isSaving} className="sm:col-span-3 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60">
                  {isSaving ? 'Guardando…' : 'Guardar y sincronizar'}
                </button>
              </form>
            </div>
          ) : (
            <p className="text-center text-muted-foreground mb-10">Inicia sesión con Google para registrar tu ciclo y sincronizarlo entre dispositivos.</p>
          )}

          <div className="grid md:grid-cols-4 gap-4">
            {phases.map((item) => (
              <div key={item.phase} className={`${item.color} border-2 rounded-xl p-6 space-y-3 hover:shadow-md transition-shadow`}>
                <div className="text-sm font-semibold text-muted-foreground">Días {item.days}</div>
                <h3 className="text-xl font-bold text-foreground">{item.phase}</h3>
                <p className="text-sm text-muted-foreground">{item.recommendation}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            {!user && <button onClick={openTracker} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Iniciar sesión y registrar mi ciclo</button>}
            <p className="text-xs text-muted-foreground mt-4">Fases y ventanas fértiles aproximadas; no sirven como método anticonceptivo ni sustituyen atención médica.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
