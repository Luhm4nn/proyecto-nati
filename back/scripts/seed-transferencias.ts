import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Asegurando datos de transferencia...\n');

    // ID 1 - Nacional
    const nacional = await prisma.datosTransferencia.upsert({
        where: { id: 1 },
        update: { tipo: 'nacional' },
        create: {
            id: 1,
            alias: '',
            cvu: '',
            nombreCuenta: '',
            tipo: 'nacional',
        },
    });
    console.log(`✅ Nacional (ID ${nacional.id}): ${nacional.tipo} - ${nacional.nombreCuenta || '(sin nombre)'}`);

    // ID 2 - Internacional
    const internacional = await prisma.datosTransferencia.upsert({
        where: { id: 2 },
        update: { tipo: 'internacional' },
        create: {
            id: 2,
            alias: '',
            cvu: '',
            nombreCuenta: '',
            tipo: 'internacional',
        },
    });
    console.log(`✅ Internacional (ID ${internacional.id}): ${internacional.tipo} - ${internacional.nombreCuenta || '(sin nombre)'}`);

    console.log('\n✨ ¡Datos de transferencia asegurados!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
