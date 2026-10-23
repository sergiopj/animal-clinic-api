import { ServiceUnavailableException } from '@nestjs/common';

import { AIService } from '../src/modules/ai/ai.service.js';
import type { PetCareProfile } from '../src/modules/ai/ai-query.model.js';
import type { ILogger } from '../src/shared/application/logging/logger.interface.js';

describe('AIService', () => {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  } as unknown as ILogger;
  const service = new AIService(logger);
  const pet: PetCareProfile = {
    id: 'pet-123',
    name: 'Luna',
    species: 'dog',
    breed: 'Labrador',
    gender: 'female',
    birthdate: new Date('2020-01-01T00:00:00.000Z'),
    medicalReport: [
      {
        date: new Date('2025-06-01T00:00:00.000Z'),
        diagnosis: 'Artritis',
        treatment: 'Seguimiento veterinario',
      },
    ],
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends age, breed, and registered conditions to Ollama', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'Cuidados:\n- Mantener el seguimiento veterinario.',
      }),
    });
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

    const report = await service.analyzePet(pet);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/generate$/),
      expect.objectContaining({ method: 'POST' })
    );
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string) as {
      prompt: string;
    };
    expect(requestBody.prompt).toContain('"raza":"Labrador"');
    expect(requestBody.prompt).toContain('"edad":"');
    expect(requestBody.prompt).toContain('"diagnostico":"Artritis"');
    expect(report.petId).toBe('pet-123');
    expect(report.recommendations).toEqual(['Mantener el seguimiento veterinario.']);
  });

  it('returns an explicit service unavailable error when Ollama fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('connection refused'));

    await expect(service.analyzePet(pet)).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
