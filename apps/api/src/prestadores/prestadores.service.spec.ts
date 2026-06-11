import { Test } from '@nestjs/testing';
import {
  OperacionNoPermitidaException,
  PerfilPrestadorExistenteException,
  PrestadorNoEncontradoException,
  SubrubroNoEncontradoException,
} from '../common/exceptions/domain.exception';
import {
  PrestadorCompleto,
  PrestadoresRepository,
} from './prestadores.repository';
import { PrestadoresService } from './prestadores.service';

describe('PrestadoresService', () => {
  let service: PrestadoresService;
  let repository: jest.Mocked<PrestadoresRepository>;

  const prestador = {
    id: 'prestador-1',
    userId: 'user-1',
    descripcion: 'Plomero matriculado',
    servicios: [],
    user: {
      id: 'user-1',
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '30123456',
      email: 'juan@test.com',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as PrestadorCompleto;

  const createDto = {
    descripcion: 'Plomero matriculado',
    servicios: [
      {
        subrubroId: 'subrubro-1',
        zonaCobertura: ['Capital'],
        disponibilidades: [],
      },
    ],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrestadoresService,
        {
          provide: PrestadoresRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            subrubrosExisten: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(PrestadoresService);
    repository = moduleRef.get(PrestadoresRepository);
  });

  describe('create', () => {
    it('should create prestador when user has no profile and subrubros exist', async () => {
      repository.findByUserId.mockResolvedValue(null);
      repository.subrubrosExisten.mockResolvedValue(true);
      repository.create.mockResolvedValue(prestador);

      const result = await service.create('user-1', createDto);

      expect(result).toBe(prestador);
      expect(repository.create).toHaveBeenCalledWith(
        'user-1',
        createDto.descripcion,
        createDto.servicios,
      );
    });

    it('should throw PerfilPrestadorExistenteException when user already has a profile', async () => {
      repository.findByUserId.mockResolvedValue(prestador);

      await expect(service.create('user-1', createDto)).rejects.toBeInstanceOf(
        PerfilPrestadorExistenteException,
      );
    });

    it('should throw SubrubroNoEncontradoException when a subrubro does not exist', async () => {
      repository.findByUserId.mockResolvedValue(null);
      repository.subrubrosExisten.mockResolvedValue(false);

      await expect(service.create('user-1', createDto)).rejects.toBeInstanceOf(
        SubrubroNoEncontradoException,
      );
    });
  });

  describe('findById', () => {
    it('should return prestador when it exists', async () => {
      repository.findById.mockResolvedValue(prestador);

      await expect(service.findById('prestador-1')).resolves.toBe(prestador);
    });

    it('should throw PrestadorNoEncontradoException when it does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('inexistente')).rejects.toBeInstanceOf(
        PrestadorNoEncontradoException,
      );
    });
  });

  describe('update', () => {
    it('should throw OperacionNoPermitidaException when user is not the owner', async () => {
      repository.findById.mockResolvedValue(prestador);

      await expect(
        service.update('prestador-1', 'otro-usuario', { descripcion: 'x' }),
      ).rejects.toBeInstanceOf(OperacionNoPermitidaException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update when user is the owner', async () => {
      repository.findById.mockResolvedValue(prestador);
      repository.update.mockResolvedValue(prestador);

      const result = await service.update('prestador-1', 'user-1', {
        descripcion: 'Nueva descripción',
      });

      expect(result).toBe(prestador);
      expect(repository.update).toHaveBeenCalledWith(
        'prestador-1',
        'Nueva descripción',
        undefined,
      );
    });
  });

  describe('remove', () => {
    it('should throw OperacionNoPermitidaException when user is not the owner', async () => {
      repository.findById.mockResolvedValue(prestador);

      await expect(
        service.remove('prestador-1', 'otro-usuario'),
      ).rejects.toBeInstanceOf(OperacionNoPermitidaException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should delete when user is the owner', async () => {
      repository.findById.mockResolvedValue(prestador);
      repository.delete.mockResolvedValue(undefined);

      await service.remove('prestador-1', 'user-1');

      expect(repository.delete).toHaveBeenCalledWith('prestador-1');
    });
  });
});
