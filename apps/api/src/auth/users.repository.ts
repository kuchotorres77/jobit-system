import { Injectable } from '@nestjs/common';
import { Prisma, Role, TipoContacto, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const perfilSelect = {
  id: true,
  nombre: true,
  apellido: true,
  documento: true,
  email: true,
  sexo: true,
  role: true,
  contactos: {
    where: { activo: true },
    select: { id: true, tipo: true, valor: true },
  },
  direcciones: {
    select: {
      id: true,
      calle: true,
      codigoPostal: true,
      provincia: true,
      departamento: true,
      localidad: true,
      pais: true,
    },
  },
} satisfies Prisma.UserSelect;

export type PerfilUsuario = Prisma.UserGetPayload<{
  select: typeof perfilSelect;
}>;

export interface CreateUserDireccionData {
  calle: string;
  codigoPostal: string;
  provincia: string;
  departamento?: string;
  localidad?: string;
}

export interface CreateUserData {
  nombre: string;
  apellido: string;
  email: string;
  documento?: string;
  password?: string;
  sexo?: 'FEMENINO' | 'MASCULINO';
  role?: Role;
  telefono?: string;
  direccion?: CreateUserDireccionData;
}

export interface UpdatePerfilData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: CreateUserDireccionData;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByDocumento(documento: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { documento } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findPerfil(id: string): Promise<PerfilUsuario | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: perfilSelect,
    });
  }

  async updateRole(id: string, role: Role): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { role } });
  }

  // Baja completa: las relaciones (prestador, contactos, reviews, etc.) caen en cascada
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  create({ telefono, direccion, ...data }: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        contactos: telefono
          ? { create: { tipo: TipoContacto.CELULAR, valor: telefono } }
          : undefined,
        direcciones: direccion ? { create: direccion } : undefined,
      },
    });
  }

  updatePerfil(
    id: string,
    { telefono, direccion, ...userData }: UpdatePerfilData,
  ): Promise<PerfilUsuario> {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data: userData });

      if (telefono) {
        const contacto = await tx.contacto.findFirst({
          where: { userId: id, tipo: TipoContacto.CELULAR, activo: true },
        });
        if (contacto) {
          await tx.contacto.update({
            where: { id: contacto.id },
            data: { valor: telefono },
          });
        } else {
          await tx.contacto.create({
            data: { userId: id, tipo: TipoContacto.CELULAR, valor: telefono },
          });
        }
      }

      if (direccion) {
        const existente = await tx.direccion.findFirst({
          where: { userId: id },
        });
        if (existente) {
          await tx.direccion.update({
            where: { id: existente.id },
            data: direccion,
          });
        } else {
          await tx.direccion.create({ data: { ...direccion, userId: id } });
        }
      }

      return tx.user.findUniqueOrThrow({
        where: { id },
        select: perfilSelect,
      });
    });
  }
}
