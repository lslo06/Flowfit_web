import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mis Favoritos</h1>
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-muted-foreground mb-6">
              Agrega productos a favoritos para guardarlos aquí
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Explorar productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Mis Favoritos ({favorites.length})
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square bg-gradient-to-br from-secondary/10 to-accent/10 overflow-hidden">
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                >
                  <Heart className="w-4 h-4 fill-destructive text-destructive" />
                </button>

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-2xl font-bold text-foreground">${item.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">MXN</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
