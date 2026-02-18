import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nombres = [
  'Juan Pérez',
  'María González',
  'Carlos Rodríguez',
  'Ana Martínez',
  'Luis Fernández',
  'Laura López',
  'Diego Silva',
  'Valentina Torres',
  'Martín Ramírez',
  'Sofía Castro',
  'Pablo Morales',
  'Lucía Romero',
  'Javier Sosa',
  'Camila Benítez',
  'Nicolás Vargas',
  'Florencia Medina',
  'Facundo Ortiz',
  'Micaela Ruiz',
  'Agustín Herrera',
  'Julieta Pereyra',
];

const niveles = ['Principiante (A1-A2)', 'Intermedio (B1-B2)', 'Avanzado (C1-C2)'];
const objetivos = [
  'Trabajo/Negocios',
  'Viajes',
  'Exámenes Internacionales',
  'Desarrollo Personal',
];

const mensajesBase = [
  'Me gustaría mejorar mi inglés conversacional para mi trabajo.',
  'Necesito prepararme para un examen internacional en 3 meses.',
  'Quiero viajar y poder comunicarme con confianza.',
  'Busco clases dinámicas para perder el miedo a hablar.',
  'Me interesa tu método porque necesito práctica real.',
  'Llevo años estudiando pero no puedo mantener una conversación.',
  'Trabajo en una empresa multinacional y necesito mejorar urgente.',
  'Quiero certificarme en TOEFL el próximo año.',
  'Me recomendaron tus clases, me interesan mucho.',
  'Necesito inglés para mi carrera profesional.',
];

const estados = ['pendiente', 'revisada', 'contactada'];

async function main() {
  console.log('🌱 Creando 20 consultas de prueba...\n');

  for (let i = 0; i < 20; i++) {
    const nivel = niveles[Math.floor(Math.random() * niveles.length)];
    const objetivo = objetivos[Math.floor(Math.random() * objetivos.length)];
    const mensajeBase = mensajesBase[Math.floor(Math.random() * mensajesBase.length)];

    const mensaje = `Nivel: ${nivel}

Objetivo: ${objetivo}

Mensaje adicional:
${mensajeBase}`;

    // Crear fechas variadas en los últimos 30 días
    const diasAtras = Math.floor(Math.random() * 30);
    const horasAtras = Math.floor(Math.random() * 24);
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - diasAtras);
    fecha.setHours(fecha.getHours() - horasAtras);

    const consulta = await prisma.consulta.create({
      data: {
        nombre: nombres[i],
        email: `${nombres[i].toLowerCase().replace(/\s/g, '.')}@mail.com`,
        telefono: `+54 9 11 ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        mensaje,
        estado: estados[Math.floor(Math.random() * estados.length)],
        createdAt: fecha,
      },
    });

    console.log(`✅ ${i + 1}. ${consulta.nombre} - ${consulta.estado}`);
  }

  console.log('\n✨ ¡20 consultas creadas exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
