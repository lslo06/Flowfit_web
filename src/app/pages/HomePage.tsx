import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductCard } from '../components/ProductCard';
import { CycleInfo } from '../components/CycleInfo';
import { Newsletter } from '../components/Newsletter';
import { PRODUCTS } from '../../data/products';
import { ExternalLink, Smartphone } from 'lucide-react';

export function HomePage() {
  const packs = PRODUCTS.filter((product) => product.type === 'pack');
  const individuals = PRODUCTS.filter((product) => product.type === 'individual');

  return (
    <main>
      <Hero />

      <div id="categorias">
        <CategorySection />
      </div>

      <section id="productos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Packs FlowFit
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Combos pensados para ahorrar y cubrir tu rutina completa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packs.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Productos individuales
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Calzones, copa, disco y crema para acompañarte en cada momento de tu ciclo
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {individuals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="ciclo">
        <CycleInfo />
      </div>

      <section id="app-movil" className="bg-primary/5 py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Smartphone className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-foreground">FlowFit también en tu celular</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Usa el seguimiento de ciclo, ejercicios, favoritos, carrito y pedidos desde tu iPhone o Android con la misma cuenta de Google.</p>
            <p className="mt-3 text-sm text-muted-foreground">En iPhone: abre la app desde Safari y elige Compartir → Añadir a pantalla de inicio.</p>
          </div>
          <a href="/app/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]">
            Abrir app móvil <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </section>

      <section id="testimonios" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Acompañamiento para cada fase
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['Registra tu ciclo', 'Guarda fechas y duración para consultar tu información en la web y Android.'],
              ['Adapta tu movimiento', 'Explora rutinas y ajusta la actividad según cómo te sientes.'],
              ['Encuentra productos', 'La tienda acompaña tu bienestar sin quitarle protagonismo a tu seguimiento.'],
            ].map(([title, description]) => (
              <div key={title} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
