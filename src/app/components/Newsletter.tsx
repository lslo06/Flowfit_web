import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Newsletter() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary to-primary/90">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Únete a nuestra comunidad
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Guarda tu ciclo y consulta recomendaciones de movimiento desde tu cuenta FlowFit.
        </p>

        <Link to="/login" className="inline-flex px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors">
          Crear cuenta o iniciar sesión
        </Link>

        <p className="text-white/70 text-sm mt-4">
          Tus datos se guardan en tu cuenta y solo tú puedes consultarlos.
        </p>
      </div>
    </section>
  );
}
