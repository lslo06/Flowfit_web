import { Dumbbell, Activity, Heart } from 'lucide-react';

export function CategorySection() {
  const categories = [
    {
      icon: Dumbbell,
      title: 'Alta Intensidad',
      description: 'Protección extra para entrenamientos intensos',
      color: 'from-primary to-primary/80'
    },
    {
      icon: Activity,
      title: 'Yoga & Pilates',
      description: 'Comodidad y libertad de movimiento',
      color: 'from-secondary to-secondary/80'
    },
    {
      icon: Heart,
      title: 'Uso Diario',
      description: 'Perfectas para tu rutina diaria',
      color: 'from-accent to-accent/80'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Para cada tipo de actividad
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra el producto perfecto según tu nivel de actividad física
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.title}
                type="button"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="group text-left bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
