import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDatosTransferenciaDto } from './dto/update-datos-transferencia.dto';

@Injectable()
export class DatosTransferenciaService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        await this.ensureDatosExist();
    }

    private async ensureDatosExist() {
        // Asegurar que existan los registros de transferencia nacional e internacional
        await this.prisma.datosTransferencia.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                alias: '',
                cvu: '',
                nombreCuenta: '',
                tipo: 'nacional',
            },
        });

        await this.prisma.datosTransferencia.upsert({
            where: { id: 2 },
            update: {},
            create: {
                id: 2,
                alias: '',
                cvu: '',
                nombreCuenta: '',
                tipo: 'internacional',
            },
        });
    }

    async getDatos() {
        return this.prisma.datosTransferencia.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async updateDatos(id: number, updateDto: UpdateDatosTransferenciaDto) {
        return this.prisma.datosTransferencia.update({
            where: { id },
            data: updateDto,
        });
    }
}
