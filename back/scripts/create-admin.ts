import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'natalia@luhmann.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Natalia Luhmann';

    if (!adminPassword) {
        console.error('❌ Error: La variable de entorno ADMIN_PASSWORD es requerida.');
        return;
    }

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log('✅ El usuario admin ya existe en la base de datos.');
      console.log('Email:', existingUser.email);
      // No mostramos la contraseña por seguridad
      return;
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        nombre: adminName,
      },
    });

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('Email:', user.email);
    console.log('Nombre:', user.nombre);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
