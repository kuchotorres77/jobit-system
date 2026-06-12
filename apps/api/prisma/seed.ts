import {
  DiaSemana,
  PrismaClient,
  Role,
  Sexo,
  TipoContacto,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const BCRYPT_SALT_ROUNDS = 10;
const DEMO_PASSWORD = 'Jobit123!';

interface RubroSeed {
  nombre: string;
  subrubros: string[];
}

interface ServicioSeed {
  rubro: string;
  subrubro: string;
  zonas: string[];
  dias: DiaSemana[];
  desde: string;
  hasta: string;
}

interface PrestadorSeed {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  sexo: Sexo;
  celular: string;
  direccion: {
    calle: string;
    codigoPostal: string;
    departamento: string;
    localidad: string;
  };
  descripcion: string;
  servicios: ServicioSeed[];
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

// Zonas alineadas con las opciones del frontend (departamentos de San Juan)
const prestadores: PrestadorSeed[] = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    documento: '28456123',
    email: 'juan.perez@jobit.demo',
    sexo: Sexo.MASCULINO,
    celular: '264-555-0101',
    direccion: {
      calle: 'Av. Libertador 1250',
      codigoPostal: '5400',
      departamento: 'Capital',
      localidad: 'San Juan',
    },
    descripcion:
      'Electricista matriculado con más de 15 años de experiencia en instalaciones domiciliarias y comerciales. Trabajos con garantía.',
    servicios: [
      {
        rubro: 'Electricista',
        subrubro: 'Instalaciones eléctricas',
        zonas: ['Capital', 'Rawson'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '08:00',
        hasta: '18:00',
      },
      {
        rubro: 'Electricista',
        subrubro: 'Iluminación',
        zonas: ['Capital'],
        dias: [DiaSemana.SABADO],
        desde: '09:00',
        hasta: '13:00',
      },
    ],
  },
  {
    nombre: 'María',
    apellido: 'Gómez',
    documento: '30789456',
    email: 'maria.gomez@jobit.demo',
    sexo: Sexo.FEMENINO,
    celular: '264-555-0102',
    direccion: {
      calle: 'Mendoza Sur 432',
      codigoPostal: '5400',
      departamento: 'Rivadavia',
      localidad: 'Rivadavia',
    },
    descripcion:
      'Servicio de limpieza profesional para hogares y oficinas. Equipo propio de productos. Puntualidad y confianza.',
    servicios: [
      {
        rubro: 'Limpieza',
        subrubro: 'Limpieza de hogar',
        zonas: ['Capital', 'Rivadavia', 'Chimbas'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MIERCOLES,
          DiaSemana.VIERNES,
        ],
        desde: '08:00',
        hasta: '16:00',
      },
      {
        rubro: 'Limpieza',
        subrubro: 'Limpieza de oficinas',
        zonas: ['Capital'],
        dias: [DiaSemana.MARTES, DiaSemana.JUEVES],
        desde: '18:00',
        hasta: '22:00',
      },
    ],
  },
  {
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    documento: '25123789',
    email: 'carlos.rodriguez@jobit.demo',
    sexo: Sexo.MASCULINO,
    celular: '264-555-0103',
    direccion: {
      calle: 'Calle 5 e/ Lemos y Vidart 88',
      codigoPostal: '5427',
      departamento: 'Pocito',
      localidad: 'Villa Aberastain',
    },
    descripcion:
      'Plomero con urgencias las 24 hs. Destapaciones con máquina, detección de pérdidas sin romper.',
    servicios: [
      {
        rubro: 'Plomero',
        subrubro: 'Destapaciones',
        zonas: ['Pocito', 'Rawson', 'Capital'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
          DiaSemana.SABADO,
          DiaSemana.DOMINGO,
          DiaSemana.FERIADOS,
        ],
        desde: '00:00',
        hasta: '23:59',
      },
      {
        rubro: 'Plomero',
        subrubro: 'Reparación de pérdidas',
        zonas: ['Pocito', 'Rawson'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '08:00',
        hasta: '17:00',
      },
    ],
  },
  {
    nombre: 'Ana',
    apellido: 'Martínez',
    documento: '33456987',
    email: 'ana.martinez@jobit.demo',
    sexo: Sexo.FEMENINO,
    celular: '264-555-0104',
    direccion: {
      calle: 'Av. Benavídez 2100',
      codigoPostal: '5400',
      departamento: 'Santa Lucía',
      localidad: 'Santa Lucía',
    },
    descripcion:
      'Jardinera paisajista. Mantenimiento mensual de jardines, poda en altura y diseño de espacios verdes.',
    servicios: [
      {
        rubro: 'Jardinero',
        subrubro: 'Mantenimiento de jardines',
        zonas: ['Rivadavia', 'Santa Lucía', 'Capital'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '07:00',
        hasta: '14:00',
      },
      {
        rubro: 'Jardinero',
        subrubro: 'Poda',
        zonas: ['Santa Lucía'],
        dias: [DiaSemana.SABADO],
        desde: '08:00',
        hasta: '12:00',
      },
    ],
  },
  {
    nombre: 'Pedro',
    apellido: 'Sánchez',
    documento: '27894561',
    email: 'pedro.sanchez@jobit.demo',
    sexo: Sexo.MASCULINO,
    celular: '264-555-0105',
    direccion: {
      calle: 'Tucumán Norte 765',
      codigoPostal: '5400',
      departamento: 'Capital',
      localidad: 'San Juan',
    },
    descripcion:
      'Carpintero de oficio. Muebles a medida en madera maciza y melamina, placares, bajo mesadas y restauración.',
    servicios: [
      {
        rubro: 'Carpintero',
        subrubro: 'Muebles a medida',
        zonas: ['Capital', 'Chimbas'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '09:00',
        hasta: '19:00',
      },
    ],
  },
  {
    nombre: 'Lucía',
    apellido: 'Fernández',
    documento: '35678234',
    email: 'lucia.fernandez@jobit.demo',
    sexo: Sexo.FEMENINO,
    celular: '264-555-0106',
    direccion: {
      calle: 'Av. Central 980',
      codigoPostal: '5400',
      departamento: 'Rivadavia',
      localidad: 'Marquesado',
    },
    descripcion:
      'Pintora profesional de interiores. Terminaciones finas, empapelado y asesoramiento en color. Presupuesto sin cargo.',
    servicios: [
      {
        rubro: 'Pintor',
        subrubro: 'Pintura de interiores',
        zonas: ['Capital', 'Rivadavia'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '08:00',
        hasta: '17:00',
      },
      {
        rubro: 'Pintor',
        subrubro: 'Empapelado',
        zonas: ['Capital', 'Rivadavia'],
        dias: [DiaSemana.SABADO],
        desde: '09:00',
        hasta: '14:00',
      },
    ],
  },
  {
    nombre: 'Diego',
    apellido: 'Castro',
    documento: '31234876',
    email: 'diego.castro@jobit.demo',
    sexo: Sexo.MASCULINO,
    celular: '264-555-0107',
    direccion: {
      calle: 'Av. Rawson Sur 1530',
      codigoPostal: '5425',
      departamento: 'Rawson',
      localidad: 'Villa Krause',
    },
    descripcion:
      'Técnico en informática. Reparación de PC y notebooks, armado de redes hogareñas y de oficina, soporte remoto.',
    servicios: [
      {
        rubro: 'Técnico en PC',
        subrubro: 'Reparación de computadoras',
        zonas: ['Capital', 'Rawson', 'Pocito'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
          DiaSemana.SABADO,
        ],
        desde: '09:00',
        hasta: '21:00',
      },
      {
        rubro: 'Técnico en PC',
        subrubro: 'Redes e internet',
        zonas: ['Capital', 'Rawson'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MIERCOLES,
          DiaSemana.VIERNES,
        ],
        desde: '09:00',
        hasta: '18:00',
      },
    ],
  },
  {
    nombre: 'Sofía',
    apellido: 'Morales',
    documento: '36987123',
    email: 'sofia.morales@jobit.demo',
    sexo: Sexo.FEMENINO,
    celular: '264-555-0108',
    direccion: {
      calle: 'Calle Nacional 245',
      codigoPostal: '5411',
      departamento: 'Santa Lucía',
      localidad: 'Alto de Sierra',
    },
    descripcion:
      'Técnica en refrigeración. Instalación de splits, mantenimiento preventivo y carga de gas con equipos certificados.',
    servicios: [
      {
        rubro: 'Técnico en Aire Acondicionado',
        subrubro: 'Instalación de equipos',
        zonas: ['Capital', 'Santa Lucía'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '08:30',
        hasta: '18:30',
      },
      {
        rubro: 'Técnico en Aire Acondicionado',
        subrubro: 'Mantenimiento y limpieza',
        zonas: ['Capital', 'Santa Lucía', 'Chimbas'],
        dias: [DiaSemana.SABADO],
        desde: '09:00',
        hasta: '13:00',
      },
    ],
  },
  {
    nombre: 'Miguel',
    apellido: 'Herrera',
    documento: '24567890',
    email: 'miguel.herrera@jobit.demo',
    sexo: Sexo.MASCULINO,
    celular: '264-555-0109',
    direccion: {
      calle: 'Av. Mendoza Norte 310',
      codigoPostal: '5413',
      departamento: 'Chimbas',
      localidad: 'Chimbas',
    },
    descripcion:
      'Cerrajería integral las 24 hs: aperturas de puertas y autos, cambio de combinación, cerraduras de seguridad.',
    servicios: [
      {
        rubro: 'Cerrajero',
        subrubro: 'Aperturas',
        zonas: [
          'Capital',
          'Rawson',
          'Pocito',
          'Rivadavia',
          'Chimbas',
          'Santa Lucía',
        ],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
          DiaSemana.SABADO,
          DiaSemana.DOMINGO,
          DiaSemana.FERIADOS,
        ],
        desde: '00:00',
        hasta: '23:59',
      },
      {
        rubro: 'Cerrajero',
        subrubro: 'Cambio de cerraduras',
        zonas: ['Chimbas', 'Capital'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '09:00',
        hasta: '18:00',
      },
    ],
  },
  {
    nombre: 'Valentina',
    apellido: 'Ríos',
    documento: '32145698',
    email: 'valentina.rios@jobit.demo',
    sexo: Sexo.FEMENINO,
    celular: '264-555-0110',
    direccion: {
      calle: 'Boulevard Sarmiento 670',
      codigoPostal: '5425',
      departamento: 'Rawson',
      localidad: 'Rawson',
    },
    descripcion:
      'Gasista matriculada. Instalaciones nuevas, conversiones, habilitaciones y certificados para ECOGAS.',
    servicios: [
      {
        rubro: 'Gasista',
        subrubro: 'Instalaciones de gas',
        zonas: ['Rawson', 'Pocito'],
        dias: [
          DiaSemana.LUNES,
          DiaSemana.MARTES,
          DiaSemana.MIERCOLES,
          DiaSemana.JUEVES,
          DiaSemana.VIERNES,
        ],
        desde: '08:00',
        hasta: '17:00',
      },
      {
        rubro: 'Gasista',
        subrubro: 'Habilitaciones y certificados',
        zonas: ['Rawson', 'Pocito', 'Capital'],
        dias: [DiaSemana.MARTES, DiaSemana.JUEVES],
        desde: '14:00',
        hasta: '18:00',
      },
    ],
  },
];

async function seedRubros(): Promise<Map<string, string>> {
  // mapa "Rubro / Subrubro" → subrubroId para vincular los servicios demo
  const subrubroIds = new Map<string, string>();

  for (const rubro of rubros) {
    const created = await prisma.rubro.upsert({
      where: { nombre: rubro.nombre },
      update: {},
      create: { nombre: rubro.nombre },
    });

    for (const subrubro of rubro.subrubros) {
      const sub = await prisma.subrubro.upsert({
        where: {
          rubroId_nombre: { rubroId: created.id, nombre: subrubro },
        },
        update: {},
        create: { rubroId: created.id, nombre: subrubro },
      });
      subrubroIds.set(`${rubro.nombre} / ${subrubro}`, sub.id);
    }

    console.log(`✓ ${rubro.nombre} (${rubro.subrubros.length} subrubros)`);
  }

  return subrubroIds;
}

async function seedPrestadores(
  subrubroIds: Map<string, string>,
): Promise<void> {
  const passwordHash = await hash(DEMO_PASSWORD, BCRYPT_SALT_ROUNDS);

  for (const seed of prestadores) {
    const existing = await prisma.user.findUnique({
      where: { email: seed.email },
    });
    if (existing) {
      if (existing.role !== Role.PROVIDER) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { role: Role.PROVIDER },
        });
        console.log(
          `- ${seed.nombre} ${seed.apellido} ya existe, rol actualizado a PROVIDER`,
        );
      } else {
        console.log(`- ${seed.nombre} ${seed.apellido} ya existe, se omite`);
      }
      continue;
    }

    const user = await prisma.user.create({
      data: {
        nombre: seed.nombre,
        apellido: seed.apellido,
        documento: seed.documento,
        email: seed.email,
        password: passwordHash,
        sexo: seed.sexo,
        role: Role.PROVIDER,
        contactos: {
          create: { tipo: TipoContacto.CELULAR, valor: seed.celular },
        },
        direcciones: {
          create: {
            calle: seed.direccion.calle,
            codigoPostal: seed.direccion.codigoPostal,
            provincia: 'San Juan',
            departamento: seed.direccion.departamento,
            localidad: seed.direccion.localidad,
          },
        },
      },
    });

    await prisma.prestador.create({
      data: {
        userId: user.id,
        descripcion: seed.descripcion,
        servicios: {
          create: seed.servicios.map((servicio) => {
            const subrubroId = subrubroIds.get(
              `${servicio.rubro} / ${servicio.subrubro}`,
            );
            if (!subrubroId) {
              throw new Error(
                `Subrubro no encontrado: ${servicio.rubro} / ${servicio.subrubro}`,
              );
            }
            return {
              subrubroId,
              zonaCobertura: servicio.zonas,
              disponibilidades: {
                create: {
                  dias: servicio.dias,
                  desde: servicio.desde,
                  hasta: servicio.hasta,
                },
              },
            };
          }),
        },
      },
    });

    console.log(
      `✓ ${seed.nombre} ${seed.apellido} — ${seed.servicios.length} servicio(s)`,
    );
  }

  console.log(`\nPassword de todos los usuarios demo: ${DEMO_PASSWORD}`);
}

// Opiniones cruzadas entre los prestadores demo (nadie opina sobre sí mismo)
const comentariosDemo: Array<{ puntaje: number; comentario: string }> = [
  { puntaje: 5, comentario: 'Muy responsable. Lo recomiendo.' },
  { puntaje: 4, comentario: 'Trabaja con materiales de calidad.' },
  { puntaje: 5, comentario: 'Ofrece garantías por su trabajo. Recomendable.' },
  { puntaje: 4, comentario: 'Cumplió con los plazos acordados.' },
  { puntaje: 3, comentario: 'Buen trabajo, aunque demoró en responder.' },
];

async function seedReviews(): Promise<void> {
  const usuarios = await prisma.user.findMany({
    where: { email: { endsWith: '@jobit.demo', not: 'admin@jobit.demo' } },
    orderBy: { email: 'asc' },
    select: { id: true, prestador: { select: { id: true } } },
  });

  let creadas = 0;
  for (let i = 0; i < usuarios.length; i++) {
    const prestadorId = usuarios[i].prestador?.id;
    if (!prestadorId) continue;

    // Cada prestador recibe 3 opiniones de los siguientes usuarios de la lista
    for (let j = 1; j <= 3; j++) {
      const opinante = usuarios[(i + j) % usuarios.length];
      if (opinante.prestador?.id === prestadorId) continue;

      const demo = comentariosDemo[(i + j) % comentariosDemo.length];
      await prisma.review.upsert({
        where: {
          prestadorId_userId: { prestadorId, userId: opinante.id },
        },
        update: {},
        create: {
          prestadorId,
          userId: opinante.id,
          puntaje: demo.puntaje,
          comentario: demo.comentario,
        },
      });
      creadas++;
    }
  }
  console.log(`✓ ${creadas} opiniones demo`);
}

async function seedAdmin(): Promise<void> {
  const passwordHash = await hash(DEMO_PASSWORD, BCRYPT_SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: 'admin@jobit.demo' },
    update: { role: Role.ADMIN },
    create: {
      nombre: 'Admin',
      apellido: 'Jobit',
      documento: '00000001',
      email: 'admin@jobit.demo',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log('✓ admin@jobit.demo (ADMIN)');
}

async function main(): Promise<void> {
  const subrubroIds = await seedRubros();
  await seedPrestadores(subrubroIds);
  await seedReviews();
  await seedAdmin();
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
