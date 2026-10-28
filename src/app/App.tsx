import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DownloadAppPage } from './pages/DownloadAppPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CartPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FavoritesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CheckoutPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/descargar" element={<AppLayout><DownloadAppPage /></AppLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Nota que aquí eliminamos <BrowserRouter> para ponerlo en el nivel más alto de la app
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
