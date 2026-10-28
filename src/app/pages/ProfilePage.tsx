import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, doc, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

import {
  LogOut,
  User,
  MapPin,
  Package,
  Activity
} from 'lucide-react';

const orderStatusLabels: Record<string, string> = {
  awaiting_payment: 'Pago pendiente',
  pending: 'Pendiente',
  paid: 'Pagado',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export function ProfilePage() {
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderLoadError, setOrderLoadError] = useState(false);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [profile, setProfile] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    setOrderLoadError(false);
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() })));
      setOrderLoadError(false);
      setLoadingOrders(false);
    }, (error) => {
      console.error('Error cargando pedidos:', error);
      setOrderLoadError(true);
      setLoadingOrders(false);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'users', user.uid), (snapshot) => setProfile(snapshot.data() ?? {}), (error) => {
      console.error('Error sincronizando el perfil:', error);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    const workoutQuery = query(collection(db, 'users', user.uid, 'workouts'), orderBy('completedAt', 'desc'), limit(8));
    return onSnapshot(workoutQuery, (snapshot) => {
      setWorkouts(snapshot.docs.map((session) => ({ id: session.id, ...session.data() })));
    }, (error) => console.error('Error sincronizando entrenamientos:', error));
  }, [user?.uid]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-card rounded-2xl border border-border overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <div className="flex items-center gap-6">

              {(profile.photo || user.photoURL) ? <img src={String(profile.photo || user.photoURL)} alt={user.displayName || 'Perfil'} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" /> : <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{(user.displayName || user.email || 'F').slice(0, 1).toUpperCase()}</div>}

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {String(profile.name || user.displayName || 'Mi cuenta')}
                </h1>

                <p className="text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>

            </div>
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-6">

            {/* Información personal */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Información Personal
                </h2>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">

                <div>
                  <label className="text-sm text-muted-foreground">
                    Nombre completo
                  </label>

                  <p className="text-foreground">
                    {[profile.name, profile.paternalName, profile.maternalName].filter((part) => typeof part === 'string' && part.trim()).join(' ') || user.displayName || '—'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Correo electrónico
                  </label>

                  <p className="text-foreground">
                    {user.email || '—'}
                  </p>
                </div>

              </div>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Entrenamientos completados</h2>
              </div>
              {workouts.length === 0 ? (
                <p className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">Tus sesiones terminadas en Android aparecerán aquí.</p>
              ) : (
                <div className="space-y-3">
                  {workouts.map((session) => (
                    <div key={session.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">{session.workoutName}</p>
                        <p className="text-sm text-muted-foreground">{session.durationMinutes} min completados</p>
                      </div>
                      <span className="text-primary">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Dirección */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />

                <h2 className="text-xl font-semibold text-foreground">
                  Dirección de Envío
                </h2>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">

                {orders[0]?.shippingAddress ? (
                  <p className="text-muted-foreground text-sm">
                    {[orders[0].shippingAddress.address, orders[0].shippingAddress.city, orders[0].shippingAddress.state, orders[0].shippingAddress.zipCode].filter(Boolean).join(', ')}
                  </p>
                ) : <p className="text-muted-foreground text-sm">La dirección se solicita al registrar un pedido.</p>}

              </div>
            </div>

            {/* Historial */}
            <div>

              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />

                <h2 className="text-xl font-semibold text-foreground">
                  Historial de Pedidos
                </h2>
              </div>

              <div className="space-y-4">

                {loadingOrders ? (

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      Cargando pedidos...
                    </p>
                  </div>

                ) : orderLoadError ? (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-red-700">No pudimos sincronizar tus pedidos. Revisa la conexión e inténtalo de nuevo.</p>
                  </div>
                ) : orders.length === 0 ? (

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      Aún no has realizado ningún pedido.
                    </p>
                  </div>

                ) : (

                  orders.map((order: any) => (

                    <div
                      key={order.id}
                      className="bg-muted/30 rounded-lg p-4 border border-border"
                    >

                      <div className="flex justify-between items-center mb-4">

                        <div>
                          <p className="font-semibold text-foreground">
                            Pedido #{order.id.slice(0, 8)}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            Estado: {orderStatusLabels[String(order.status)] ?? 'Pendiente'}
                          </p>
                          {order.status === 'awaiting_payment' && <p className="text-xs text-amber-700">No se ha realizado ningún cobro.</p>}
                        </div>

                        <p className="font-bold text-primary">
                          ${order.total} MXN
                        </p>

                      </div>

                      <div className="space-y-3">

                        {order.items.map((item: any) => (

                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >

                            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-muted" /> : <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground" /></div>}

                            <div className="flex-1">

                              <p className="font-medium text-foreground">
                                {item.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                Cantidad: {item.quantity}
                              </p>

                            </div>

                            <p className="font-semibold text-primary">
                              ${item.price * item.quantity} MXN
                            </p>

                          </div>

                        ))}

                      </div>

                    </div>

                  ))

                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
