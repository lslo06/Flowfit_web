import heroImage from '../../imports/image-6.png';

export function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToCycle = () => document.getElementById('ciclo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative bg-gradient-to-br from-secondary/20 via-accent/10 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Entrena con confianza durante tu ciclo
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Productos de higiene femenina diseñados específicamente para mujeres activas.
              Protección superior que se adapta a cada fase de tu ciclo menstrual.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={scrollToProducts}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Comprar ahora
              </button>
              <button onClick={scrollToCycle} className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                Conoce más
              </button>
            </div>

            <p className="pt-4 text-sm text-muted-foreground">Ciclo, movimiento y productos de bienestar en un solo lugar.</p>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-accent/40 to-secondary/40 rounded-3xl overflow-hidden">
              <img
                src={heroImage}
                alt="FlowFit Products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
