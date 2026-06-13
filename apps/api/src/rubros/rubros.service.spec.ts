import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import {
  RubroEnUsoException,
  RubroNoEncontradoException,
  RubroYaExisteException,
} from '../common/exceptions/domain.exception';
import { RubroCompleto, RubrosRepository } from './rubros.repository';
import { RubrosService } from './rubros.service';

function errorDeFk(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('FK violada', {
    code: 'P2003',
    clientVersion: 'test',
  });
}

describe('RubrosService', () => {
  let service: RubrosService;
  let repository: jest.Mocked<RubrosRepository>;

  const rubro = {
    id: 'rubro-1',
    nombre: 'Plomero',
    subrubros: [{ id: 'sub-1', nombre: 'Destapaciones', rubroId: 'rubro-1' }],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as RubroCompleto;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RubrosService,
        {
          provide: RubrosRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByNombre: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(RubrosService);
    repository = moduleRef.get(RubrosRepository);
  });

  describe('update', () => {
    it('should update nombre and subrubros when valid', async () => {
      repository.findById.mockResolvedValue(rubro);
      repository.findByNombre.mockResolvedValue(null);
      repository.update.mockResolvedValue(rubro);

      const dto = {
        nombre: 'Plomería',
        subrubros: [{ id: 'sub-1', nombre: 'Destapaciones urgentes' }],
      };
      await service.update('rubro-1', dto);

      expect(repository.update).toHaveBeenCalledWith(
        'rubro-1',
        'Plomería',
        dto.subrubros,
      );
    });

    it('should throw RubroNoEncontradoException when rubro does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('inexistente', { nombre: 'x' }),
      ).rejects.toBeInstanceOf(RubroNoEncontradoException);
    });

    it('should throw RubroYaExisteException when renaming to an existing nombre', async () => {
      repository.findById.mockResolvedValue(rubro);
      repository.findByNombre.mockResolvedValue({
        ...rubro,
        id: 'otro-rubro',
      });

      await expect(
        service.update('rubro-1', { nombre: 'Electricista' }),
      ).rejects.toBeInstanceOf(RubroYaExisteException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw RubroEnUsoException when removing a subrubro in use', async () => {
      repository.findById.mockResolvedValue(rubro);
      repository.update.mockRejectedValue(errorDeFk());

      await expect(
        service.update('rubro-1', { subrubros: [{ nombre: 'Nuevo' }] }),
      ).rejects.toBeInstanceOf(RubroEnUsoException);
    });
  });

  describe('remove', () => {
    it('should delete the rubro when it is not in use', async () => {
      repository.findById.mockResolvedValue(rubro);
      repository.delete.mockResolvedValue(undefined);

      await service.remove('rubro-1');

      expect(repository.delete).toHaveBeenCalledWith('rubro-1');
    });

    it('should throw RubroEnUsoException when rubro has servicios asociados', async () => {
      repository.findById.mockResolvedValue(rubro);
      repository.delete.mockRejectedValue(errorDeFk());

      await expect(service.remove('rubro-1')).rejects.toBeInstanceOf(
        RubroEnUsoException,
      );
    });

    it('should throw RubroNoEncontradoException when rubro does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('inexistente')).rejects.toBeInstanceOf(
        RubroNoEncontradoException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
