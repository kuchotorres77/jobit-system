import { api, ApiError } from "./client";
import { CreateReviewPayload, Review, ReviewsListado } from "./types";

export function getReviews(
  prestadorId: string,
  page = 1,
  limit = 10,
): Promise<ReviewsListado> {
  return api.get<ReviewsListado>(
    `/prestadores/${prestadorId}/reviews?page=${page}&limit=${limit}`,
  );
}

/** Opinión propia del usuario logueado, o null si todavía no opinó. */
export async function getMiReview(prestadorId: string): Promise<Review | null> {
  try {
    return await api.get<Review>(`/prestadores/${prestadorId}/reviews/mia`, true);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export function opinar(
  prestadorId: string,
  payload: CreateReviewPayload,
): Promise<Review> {
  return api.post<Review>(`/prestadores/${prestadorId}/reviews`, payload, true);
}

export function eliminarMiReview(prestadorId: string): Promise<void> {
  return api.delete<void>(`/prestadores/${prestadorId}/reviews/mia`);
}
