import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  /** UID de Firebase Auth; coincide con request.auth.uid en reglas de /orders */
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

async function syncUserProfile(firebaseUser: User) {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const existing = await getDoc(userRef);
  const previous = existing.data();
  await setDoc(userRef, {
    uid: firebaseUser.uid,
    name: typeof previous?.name === 'string' && previous.name.trim() ? previous.name : firebaseUser.displayName ?? '',
    email: firebaseUser.email ?? '',
    photo: typeof previous?.photo === 'string' && previous.photo ? previous.photo : firebaseUser.photoURL ?? '',
    updatedAt: serverTimestamp(),
    ...(previous?.createdAt == null ? { createdAt: serverTimestamp() } : {}),
  }, { merge: true });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await syncUserProfile(firebaseUser);
        } catch (error) {
          console.error('Error al sincronizar sesión:', error);
        }
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.uid ?? null,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
