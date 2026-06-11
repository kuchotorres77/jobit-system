import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RubroSeed {
  nombre: string;
  subrubros: string[];
}

const rubros: RubroSeed[] = [
  {
    nombre: 'Electricista',
    subrubros: [
      'Instalaciones eléctricas',
      'Reparaciones',
      'Tableros y disyuntores',
      'Iluminación',
    ],
  },
  {
    nombre: 'Plomero',
    subrubros: [
      'Destapaciones',
      'Instalaciones sanitarias',
      'Reparación de pérdidas',
      'Termotanques y calefones',
    ],
  },
  {
    nombre: 'Gasista',
    subrubros: [
      'Instalaciones de gas',
      'Reparación de artefactos',
      'Habilitaciones y certificados',
    ],
  },
  {
    nombre: 'Carpintero',
    subrubros: [
      'Muebles a medida',
      'Aberturas y puertas',
      'Restauración',
      'Deck y pérgolas',
    ],
  },
  {
    nombre: 'Jardinero',
    subrubros: [
      'Mantenimiento de jardines',
      'Poda',
      'Diseño de espacios verdes',
      'Riego automático',
    ],
  },
  {
    nombre: 'Limpieza',
    subrubros: [
      'Limpieza de hogar',
      'Limpieza de oficinas',
      'Limpieza post obra',
      'Limpieza de vidrios',
    ],
  },
  {
    nombre: 'Pintor',
    subrubros: [
      'Pintura de interiores',
      'Pintura de exteriores',
      'Empapelado',
      'Impermeabilización',
    ],
  },
  {
    nombre: 'Cerrajero',
    subrubros: [
      'Aperturas',
      'Cambio de cerraduras',
      'Copias de llaves',
      'Cerraduras electrónicas',
    ],
  },
  {
    nombre: 'Técnico en PC',
    subrubros: [
      'Reparación de computadoras',
      'Redes e internet',
      'Instalación de software',
      'Recuperación de datos',
    ],
  },
  {
    nombre: 'Técnico en Aire Acondicionado',
    subrubros: [
      'Instalación de equipos',
      'Mantenimiento y limpieza',
      'Carga de gas',
      'Reparaciones',
    ],
  },
];

async function main(): Promise<void> {
  for (const rubro of rubros) {
    const created = await prisma.rubro.upsert({
      where: { nombre: rubro.nombre },
      update: {},
      create: { nombre: rubro.nombre },
    });

    for (const subrubro of rubro.subrubros) {
      await prisma.subrubro.upsert({
        where: {
          rubroId_nombre: { rubroId: created.id, nombre: subrubro },
        },
        update: {},
        create: { rubroId: created.id, nombre: subrubro },
      });
    }

    console.log(`✓ ${rubro.nombre} (${rubro.subrubros.length} subrubros)`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
