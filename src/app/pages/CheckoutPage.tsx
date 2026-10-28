import { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft, CheckCircle2, Clock3 } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../../firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, writeBatch } from 'firebase/firestore';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  // Datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México'
  });

  useEffect(() => {
    let active = true;
    if (!user?.uid) return () => { active = false; };

    const loadSavedAddress = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);
        let savedAddress = userSnapshot.data()?.checkoutProfile;

        // Existing orders are the source for users who checked out before this shared profile existed.
        if (!savedAddress) {
          const latestOrder = await getDocs(query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(1),
          ));
          savedAddress = latestOrder.docs[0]?.data()?.shippingAddress;
          if (savedAddress) {
            await setDoc(userRef, { checkoutProfile: savedAddress, updatedAt: serverTimestamp() }, { merge: true });
          }
        }

        if (active && savedAddress && typeof savedAddress === 'object') {
          setShippingData(previous => ({
            ...previous,
            ...Object.fromEntries(Object.entries(savedAddress).filter(([, value]) => typeof value === 'string' && value.trim())),
          }));
        }
      } catch (error) {
        console.error('No se pudo cargar la dirección guardada:', error);
      }
    };

    void loadSavedAddress();
    return () => { active = false; };
  }, [user?.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validar datos de envío
    if (!shippingData.fullName.trim() || !shippingData.address.trim() || !shippingData.city.trim() ||
        !shippingData.state.trim() || !/^\d{5}$/.test(shippingData.zipCode) || shippingData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Revisa los datos de envío, usa un teléfono de al menos 10 dígitos y un código postal de 5 números.');
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    setIsProcessing(true);

    try {
      const finalTotal = cartTotal;
      
      // Crear orden en Firestore
      const orderRef = doc(collection(db, 'orders'));
      const batch = writeBatch(db);
      batch.set(orderRef, {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
        shippingAddress: shippingData,
        status: 'awaiting_payment',
        createdAt: serverTimestamp()
      });
      batch.set(doc(db, 'users', user.uid), {
        checkoutProfile: shippingData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await batch.commit();
      
      setOrderTotal(finalTotal);
      
      // Limpiar carrito
      clearCart();
      
      // Mostrar confirmación
      setOrderId(orderRef.id);
      setOrderComplete(true);
      
      toast.success('Solicitud de pedido guardada. El pago sigue pendiente.');

    } catch (error) {
      console.error('Error al procesar orden:', error);
      toast.error('No se pudo registrar el pedido. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pantalla de confirmación
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Solicitud recibida
          </h1>

          <p className="text-muted-foreground mb-6">
            El pedido quedó guardado, pero todavía no se ha realizado ningún cobro.
          </p>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Número de orden</p>
            <p className="font-mono font-semibold text-foreground">#{orderId.slice(-8).toUpperCase()}</p>
          </div>

          <div className="space-y-3 mb-6 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total pendiente:</span>
              <span className="font-semibold text-foreground">${orderTotal} MXN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío a:</span>
              <span className="font-semibold text-foreground">{shippingData.city}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            El correo de tu cuenta es {user?.email}. No se envió una confirmación automática ni se ha configurado el seguimiento del pedido.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Solicitar pedido</h1>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de envío */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Información de Envío</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="55 1234 5678"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Calle, número, colonia"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingData.zipCode}
                    onChange={handleInputChange}
                    placeholder="01234"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingData.country}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-amber-300/60 bg-amber-50/50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Pago pendiente de integración</h2>
                  <p className="text-sm text-muted-foreground">No escribas datos de tarjeta aquí. Esta solicitud no realiza ningún cargo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary">${item.price * item.quantity} MXN</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cartTotal} MXN</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-lg">
                  <span>Total</span>
                  <span>${cartTotal} MXN</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>Solicitar pedido · pago pendiente</span>
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                La solicitud no confirma pago ni envío. Tus datos de envío se guardarán para futuras compras en web y Android.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
