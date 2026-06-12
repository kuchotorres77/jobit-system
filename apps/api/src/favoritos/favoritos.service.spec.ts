import { Test } from '@nestjs/testing';
import { PrestadorNoEncontradoException } from '../common/exceptions/domain.exception';
import { PrestadoresRepository } from '../prestadores/prestadores.repository';
import { FavoritosRepository } from './favoritos.repository';
import { FavoritosService } from './favoritos.service';

describe('FavoritosService', () => {
  let service: FavoritosService;
  let favoritosRepository: jest.Mocked<FavoritosRepository>;
  let prestadoresRepository: jest.Mocked<PrestadoresRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FavoritosService,
        {
          provide: FavoritosRepository,
          useValue: {
            idsDeUsuario: jest.fn(),
            idsDeUsuarioPaginado: jest.fn(),
            agregar: jest.fn(),
            quitar: jest.fn(),
          },
        },
        {
          provide: PrestadoresRepository,
          useValue: {
            findById: jest.fn(),
            findManyPorIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(FavoritosService);
    favoritosRepository = moduleRef.get(FavoritosRepository);
    prestadoresRepository = moduleRef.get(PrestadoresRepository);
  });

  describe('listarIds', () => {
    it('should return the prestador ids of the user', async () => {
      favoritosRepository.idsDeUsuario.mockResolvedValue(['p-1', 'p-2']);

      await expect(service.listarIds('user-1')).resolves.toEqual([
        'p-1',
        'p-2',
      ]);
    });
  });

  describe('listarPrestadores', () => {
    it('should return paginated prestadores in favorito order', async () => {
      const prestadores = [{ id: 'p-2' }, { id: 'p-1' }];
      favoritosRepository.idsDeUsuarioPaginado.mockResolvedValue({
        prestadorIds: ['p-2', 'p-1'],
        total: 5,
      });
      prestadoresRepository.findManyPorIds.mockResolvedValue(
        prestadores as never,
      );

      const result = await service.listarPrestadores('user-1', 2, 2);

      expect(favoritosRepository.idsDeUsuarioPaginado).toHaveBeenCalledWith(
        'user-1',
        2,
        2,
      );
      expect(prestadoresRepository.findManyPorIds).toHaveBeenCalledWith([
        'p-2',
        'p-1',
      ]);
      expect(result.data).toBe(prestadores);
      expect(result.meta).toEqual({ total: 5, page: 2, limit: 2 });
    });
  });

  describe('agregar', () => {
    it('should add the favorito when prestador exists', async () => {
      prestadoresRepository.findById.mockResolvedValue({
        id: 'p-1',
      } as never);

      await service.agregar('user-1', 'p-1');

      expect(favoritosRepository.agregar).toHaveBeenCalledWith('user-1', 'p-1');
    });

    it('should throw PrestadorNoEncontradoException when prestador does not exist', async () => {
      prestadoresRepository.findById.mockResolvedValue(null);

      await expect(service.agregar('user-1', 'inexistente')).rejects.toBeInstanceOf(
        PrestadorNoEncontradoException,
      );
      expect(favoritosRepository.agregar).not.toHaveBeenCalled();
    });
  });

  describe('quitar', () => {
    it('should remove the favorito without failing when it does not exist', async () => {
      favoritosRepository.quitar.mockResolvedValue(undefined);

      await expect(service.quitar('user-1', 'p-1')).resolves.toBeUndefined();
      expect(favoritosRepository.quitar).toHaveBeenCalledWith('user-1', 'p-1');
    });
  });
});
