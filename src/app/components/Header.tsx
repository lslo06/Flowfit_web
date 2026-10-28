import { ShoppingCart, Menu, User, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../imports/flowfit-emblem.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user } = useAuth();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <img src={logo} alt="FlowFit" className="h-10 w-10" />
              <span className="font-semibold text-xl text-foreground">FlowFit</span>
            </button>

            <nav className="hidden lg:flex items-center gap-6">
              <button onClick={() => scrollToSection('categorias')} className="text-sm hover:text-primary transition-colors">
                Ejercicios
              </button>
              <button onClick={() => scrollToSection('productos')} className="text-sm hover:text-primary transition-colors">
                Productos
              </button>
              <button onClick={() => scrollToSection('ciclo')} className="text-sm hover:text-primary transition-colors">
                Ciclo Menstrual
              </button>
              
              <button onClick={() => scrollToSection('testimonios')} className="text-sm hover:text-primary transition-colors">
                Bienestar
              </button>
              <button onClick={() => scrollToSection('app-movil')} className="text-sm hover:text-primary transition-colors">
                App móvil
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigation('/favorites')}
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavigation(user ? '/profile' : '/login')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {user && user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => handleNavigation('/cart')}
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection('productos')} className="text-sm hover:text-primary transition-colors text-left py-2">
                Productos
              </button>
              <button onClick={() => scrollToSection('ciclo')} className="text-sm hover:text-primary transition-colors text-left py-2">
                Ciclo Menstrual
              </button>
              <button onClick={() => scrollToSection('categorias')} className="text-sm hover:text-primary transition-colors text-left py-2">
                Ejercicios
              </button>
              <button onClick={() => scrollToSection('testimonios')} className="text-sm hover:text-primary transition-colors text-left py-2">
                Bienestar
              </button>
              <button onClick={() => scrollToSection('app-movil')} className="text-sm hover:text-primary transition-colors text-left py-2">
                App móvil
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
