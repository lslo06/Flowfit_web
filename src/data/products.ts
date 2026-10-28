import indNegro from '../imports/ind_negro.webp';
import indRosa from '../imports/ind_rosa.webp';
import indMorado from '../imports/ind_morado.webp';
import indCrema from '../imports/ind_crema.webp';
import indCopa from '../imports/ind_copa.webp';
import indDisc from '../imports/ind_disc.webp';
import packImg from '../imports/pack.webp';
import packImg2 from '../imports/pack_2.webp';
import packImg3 from '../imports/pack_3.webp';
import packImg4 from '../imports/pack_4.webp';

export type ProductType = 'individual' | 'pack';

export interface Product {
  id: number;
  name: string;
  price: number;
  type: ProductType;
  description: string;
  imageUrl: string;
  badge?: string;
  includes?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Flow Sport Negro',
    price: 549,
    type: 'individual',
    description: 'Calzón menstrual deportivo de alto rendimiento',
    imageUrl: indNegro,
    badge: 'Más vendido'
  },
  {
    id: 2,
    name: 'Flow Sport Rosa',
    price: 549,
    type: 'individual',
    description: 'Calzón menstrual deportivo en tono rosado',
    imageUrl: indRosa
  },
  {
    id: 3,
    name: 'Flow Sport Morado',
    price: 549,
    type: 'individual',
    description: 'Calzón menstrual deportivo en tono morado',
    imageUrl: indMorado,
    badge: 'Nuevo'
  },
  {
    id: 4,
    name: 'Flow Sport Crema',
    price: 549,
    type: 'individual',
    description: 'Calzón menstrual deportivo en tono crema',
    imageUrl: indCrema
  },
  {
    id: 5,
    name: 'Copa menstrual FlowFit',
    price: 585,
    type: 'individual',
    description: 'Copa reutilizable de silicona médica',
    imageUrl: indCopa
  },
  {
    id: 6,
    name: 'Disco menstrual FlowFit',
    price: 699,
    type: 'individual',
    description: 'Disco reutilizable para mayor libertad de movimiento',
    imageUrl: indDisc
  },
  {
    id: 7,
    name: 'Pack Starter',
    price: 1497,
    type: 'pack',
    description: 'Ideal para comenzar tu experiencia FlowFit',
    imageUrl: packImg,
    badge: 'Ahorra $150',
    includes: ['Flow Sport Negro', 'Flow Sport Rosa', 'Flow Sport Morado']
  },
  {
    id: 8,
    name: 'Pack disc flow',
    price: 1749,
    type: 'pack',
    description: 'Para entrenadoras de alto rendimiento',
    imageUrl: packImg2,
    badge: 'Más popular',
    includes: ['Flow Sport Rosa', 'Flow Sport Negro', 'Disco menstrual FlowFit']
  },
  {
    id: 9,
    name: 'Pack copa flow',
    price: 1849,
    type: 'pack',
    description: 'El paquete completo para guerreras FlowFit',
    imageUrl: packImg3,
    badge: 'Mejor valor',
    includes: ['Flow Sport Morado', 'Flow Sport Rosa', 'Copa menstrual FlowFit']
  },
  {
    id: 10,
    name: 'Pack Libertad total',
    price: 2495,
    type: 'pack',
    description: 'El paquete completo para guerreras FlowFit',
    imageUrl: packImg4,
    badge: 'Mejor valor',
    includes: ['Flow Sport Negro', 'Flow Sport Rosa', 'Flow Sport Morado', 'Flow Sport Crema', 'Copa menstrual FlowFit', 'Disco menstrual FlowFit']
  }
];
