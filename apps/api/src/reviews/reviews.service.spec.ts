import { Test } from '@nestjs/testing';
import {
  NoPuedeOpinarSobreSiMismoException,
  PrestadorNoEncontradoException,
  ReviewNoEncontradaException,
} from '../common/exceptions/domain.exception';
import { PrestadoresRepository } from '../prestadores/prestadores.repository';
import { ReviewCompleta, ReviewConVotos, ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewsRepository: jest.Mocked<ReviewsRepository>;
  let prestadoresRepository: jest.Mocked<PrestadoresRepository>;

  const prestador = { id: 'prestador-1', userId: 'duenio-1' };

  const review = {
    id: 'review-1',
    prestadorId: 'prestador-1',
    userId: 'user-1',
    puntaje: 5,
    comentario: 'Excelente',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: 'user-1', nombre: 'Juan', apellido: 'Pérez' },
    _count: { votos: 0 },
  } as ReviewCompleta;

  const reviewConVotos: ReviewConVotos = {
    id: 'review-1',
    prestadorId: 'prestador-1',
    userId: 'user-1',
    puntaje: 5,
    comentario: 'Excelente',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: 'user-1', nombre: 'Juan', apellido: 'Pérez' },
    votos: 0,
    miVoto: false,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: ReviewsRepository,
          useValue: {
            upsert: jest.fn(),
            findByPrestador: jest.fn(),
            findPropia: jest.fn(),
            deletePropia: jest.fn(),
            resumen: jest.fn(),
            toggleVoto: jest.fn(),
          },
        },
        {
          provide: PrestadoresRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ReviewsService);
    reviewsRepository = moduleRef.get(ReviewsRepository);
    prestadoresRepository = moduleRef.get(PrestadoresRepository);
  });

  describe('opinar', () => {
    const dto = { puntaje: 5, comentario: 'Excelente' };

    it('should upsert the review when prestador exists and user is not the owner', async () => {
      prestadoresRepository.findById.mockResolvedValue(prestador as never);
      reviewsRepository.upsert.mockResolvedValue(review);

      const result = await service.opinar('prestador-1', 'user-1', dto);

      expect(result).toBe(review);
      expect(reviewsRepository.upsert).toHaveBeenCalledWith(
        'prestador-1',
        'user-1',
        5,
        'Excelente',
      );
    });

    it('should throw PrestadorNoEncontradoException when prestador does not exist', async () => {
      prestadoresRepository.findById.mockResolvedValue(null);

      await expect(
        service.opinar('inexistente', 'user-1', dto),
      ).rejects.toBeInstanceOf(PrestadorNoEncontradoException);
      expect(reviewsRepository.upsert).not.toHaveBeenCalled();
    });

    it('should throw NoPuedeOpinarSobreSiMismoException when user owns the prestador', async () => {
      prestadoresRepository.findById.mockResolvedValue(prestador as never);

      await expect(
        service.opinar('prestador-1', 'duenio-1', dto),
      ).rejects.toBeInstanceOf(NoPuedeOpinarSobreSiMismoException);
      expect(reviewsRepository.upsert).not.toHaveBeenCalled();
    });
  });

  describe('listar', () => {
    it('should return paginated reviews with resumen', async () => {
      prestadoresRepository.findById.mockResolvedValue(prestador as never);
      reviewsRepository.findByPrestador.mockResolvedValue({
        data: [reviewConVotos],
        total: 1,
      });
      reviewsRepository.resumen.mockResolvedValue({
        promedio: 5,
        total: 1,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
      });

      const result = await service.listar('prestador-1', 2, 10);

      expect(reviewsRepository.findByPrestador).toHaveBeenCalledWith(
        'prestador-1',
        10,
        10,
        undefined,
      );
      expect(result.meta).toEqual({ total: 1, page: 2, limit: 10 });
      expect(result.resumen.promedio).toBe(5);
    });

    it('should throw PrestadorNoEncontradoException when prestador does not exist', async () => {
      prestadoresRepository.findById.mockResolvedValue(null);

      await expect(service.listar('inexistente', 1, 10)).rejects.toBeInstanceOf(
        PrestadorNoEncontradoException,
      );
    });
  });

  describe('propia', () => {
    it('should return own review when it exists', async () => {
      reviewsRepository.findPropia.mockResolvedValue(review);

      await expect(service.propia('prestador-1', 'user-1')).resolves.toBe(
        review,
      );
    });

    it('should throw ReviewNoEncontradaException when user has no review', async () => {
      reviewsRepository.findPropia.mockResolvedValue(null);

      await expect(
        service.propia('prestador-1', 'user-1'),
      ).rejects.toBeInstanceOf(ReviewNoEncontradaException);
    });
  });

  describe('eliminarPropia', () => {
    it('should delete own review', async () => {
      reviewsRepository.deletePropia.mockResolvedValue(true);

      await expect(
        service.eliminarPropia('prestador-1', 'user-1'),
      ).resolves.toBeUndefined();
    });

    it('should throw ReviewNoEncontradaException when there is nothing to delete', async () => {
      reviewsRepository.deletePropia.mockResolvedValue(false);

      await expect(
        service.eliminarPropia('prestador-1', 'user-1'),
      ).rejects.toBeInstanceOf(ReviewNoEncontradaException);
    });
  });
});
