import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'natalia@luhmann.com' },
    });

    if (existingUser) {
      console.log('✅ Usuario admin ya existe');
      console.log('Email:', existingUser.email);
      console.log('Nombre:', existingUser.nombre);
      return;
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash('natalia2024', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'natalia@luhmann.com',
        password: hashedPassword,
        nombre: 'Natalia Luhmann',
      },
    });

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('Email:', user.email);
    console.log('Password: natalia2024');
    console.log('Nombre:', user.nombre);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
