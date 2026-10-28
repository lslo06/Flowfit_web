import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';
import { PRODUCTS } from '../data/products';

export interface FavoriteItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: FavoriteItem) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  favoritesCount: 0
});

export const useFavorites = () => useContext(FavoritesContext);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const favRef = doc(db, 'users', user.uid);
    return onSnapshot(favRef, (favDoc) => {
      try {
        const rawFavorites = favDoc.exists() ? favDoc.data().favorites : null;
        const storedItems: unknown[] = Array.isArray(rawFavorites)
          ? rawFavorites
          : rawFavorites && typeof rawFavorites === 'object'
            ? Object.values(rawFavorites as Record<string, unknown>)
            : [];
        // Android stores IDs while web stores full objects. Resolve either format
        // against the web catalog, which owns the canonical product information.
        const resolved = storedItems.flatMap((entry) => {
          const stored = typeof entry === 'number' || typeof entry === 'string'
            ? { id: entry }
            : (entry && typeof entry === 'object' ? entry as Partial<FavoriteItem> : null);
          const product = PRODUCTS.find((item) => item.id === Number(stored?.id));
          return product ? [{ id: product.id, name: product.name, description: product.description, price: product.price, imageUrl: product.imageUrl }] : [];
        });
        setFavorites(resolved);
      } catch (error) {
        console.error('Error al procesar favoritos:', error);
      }
    }, (error) => console.error('Error al sincronizar favoritos:', error));
  }, [user?.uid]);

  const saveFavoritesToFirestore = async (updatedFavorites: FavoriteItem[]) => {
    if (!user) return;

    try {
      const favRef = doc(db, 'users', user.uid);
      const favObject = updatedFavorites.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, FavoriteItem>);

      await setDoc(favRef, { favorites: favObject }, { merge: true });
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
    }
  };

  const addToFavorites = (product: FavoriteItem) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((item) => item.id === product.id);
      if (exists) return prevFavorites;

      const updatedFavorites = [...prevFavorites, product];
      saveFavoritesToFirestore(updatedFavorites);
      return updatedFavorites;
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((item) => item.id !== productId);
      saveFavoritesToFirestore(updatedFavorites);
      return updatedFavorites;
    });
  };

  const isFavorite = (productId: number) => {
    return favorites.some((item) => item.id === productId);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      favoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}
