import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductCard } from '../components/ProductCard';
import { CycleInfo } from '../components/CycleInfo';
import { Newsletter } from '../components/Newsletter';
import { PRODUCTS } from '../../data/products';

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
