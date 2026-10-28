import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';
import { PRODUCTS } from '../data/products';

export interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Cargar carrito desde Firestore cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      const cartRef = doc(db, 'users', user.uid);
      return onSnapshot(cartRef, (cartDoc) => {
        const cartData = cartDoc.data()?.cart;
        if (!cartData || typeof cartData !== 'object') {
          setCart([]);
          return;
        }
        const storedEntries: Array<[string, unknown]> = Array.isArray(cartData)
          ? cartData.map((item, index) => [String(index), item])
          : Object.entries(cartData as Record<string, unknown>);
        const items = storedEntries.flatMap(([key, value]) => {
          const stored = value && typeof value === 'object' ? value as Partial<CartItem> : null;
          const productId = Number(stored?.id ?? key);
          const product = PRODUCTS.find((item) => item.id === productId);
          const rawQuantity = stored?.quantity ?? (typeof value === 'number' ? value : 1);
          const quantity = Number(rawQuantity);
          return product && Number.isInteger(quantity) && quantity > 0
            ? [{ ...product, quantity }]
            : [];
        });
        setCart(items);
      }, (error) => console.error('Error al sincronizar carrito:', error));
    } else {
      setCart([]);
    }
  }, [user?.uid]);

  const saveCartToFirestore = async (updatedCart: CartItem[]) => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'users', user.uid);
      const cartObject = updatedCart.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, CartItem>);

      await setDoc(cartRef, { cart: cartObject }, { merge: true });
    } catch (error) {
      console.error("Error al guardar carrito:", error);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = async (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        const cartRef = doc(db, 'users', user.uid);
        await updateDoc(cartRef, { cart: deleteField() });
      } catch (error) {
        console.error("Error al limpiar carrito:", error);
      }
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}
