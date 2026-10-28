import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge?: string;
  includes?: string[];
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  badge,
  includes
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    addToCart({ id, name, price, imageUrl });
    toast.success('Producto agregado al carrito');
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      navigate('/login');
      return;
    }

    if (isFavorite(id)) {
      removeFromFavorites(id);
      toast.success('Eliminado de favoritos');
    } else {
      addToFavorites({ id, name, price, imageUrl });
      toast.success('Agregado a favoritos');
    }
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square bg-gradient-to-br from-secondary/10 to-accent/10 overflow-hidden">
        {badge && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs z-10">
            {badge}
          </div>
        )}

        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite(id) ? 'fill-destructive text-destructive' : 'text-foreground'}`}
          />
        </button>

        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {includes && includes.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {includes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-foreground">${price}</span>
            <span className="text-sm text-muted-foreground ml-1">MXN</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
