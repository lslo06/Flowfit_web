import logo from '../../imports/flowfit-emblem.png';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FlowFit" className="h-10 w-10" />
              <span className="font-semibold text-xl text-foreground">FlowFit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu aliada en cada fase del ciclo. Productos diseñados para mujeres activas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#productos" className="text-muted-foreground hover:text-primary transition-colors">Todos los productos</a></li>
              <li><a href="/#categorias" className="text-muted-foreground hover:text-primary transition-colors">Elegir por actividad</a></li>
              <li><a href="/#ciclo" className="text-muted-foreground hover:text-primary transition-colors">Bienestar del ciclo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#ciclo" className="text-muted-foreground hover:text-primary transition-colors">Guía del ciclo</a></li>
              <li><a href="/app/" className="text-muted-foreground hover:text-primary transition-colors">App móvil</a></li>
              <li><Link to="/descargar" className="text-muted-foreground hover:text-primary transition-colors">Descargar Android</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">Mi cuenta y pedidos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#testimonios" className="text-muted-foreground hover:text-primary transition-colors">Bienestar</a></li>
              <li><Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">Carrito</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Acceder a mi cuenta</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2026 FlowFit. Todos los derechos reservados. Diseñado con ❤️ para mujeres activas.</p>
        </div>
      </div>
    </footer>
  );
}
