import { useCart } from '../../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Tu Carrito</h1>
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Ir a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Tu Carrito ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-4 flex gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg bg-muted"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  {item.description && <p className="text-sm text-muted-foreground mb-1">{item.description}</p>}
                  <p className="text-lg font-bold text-primary">${item.price} MXN</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cartTotal} MXN</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-lg">
                  <span>Total</span>
                  <span>${cartTotal} MXN</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Proceder al pago
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
