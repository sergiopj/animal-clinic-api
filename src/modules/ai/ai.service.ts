import { injectable, inject } from 'tsyringe';
import { ILogger } from '../../shared/application/logging/logger.interface.js';
import { aiConfig } from '../../shared/config/ai.config.js';
import { AIResponseDTO } from './ai-query.model.js';
import type { IPet } from '../pet/pet.entity.js';

// <--- 3. THE HEART: Logic for LangChain/Ollama
@injectable()
export class AIService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * Analyze pet data with AI using Ollama
   */
  public async analyzePet(pet: IPet, query: string): Promise<AIResponseDTO> {
    this.logger.info(`AIService: Analyzing pet ${pet.id} with query: ${query}`);

    const prompt = this.buildPrompt(pet, query);

    try {
      const response = await this.callOllama(prompt);

      return {
        petId: pet.id,
        petName: pet.name,
        query,
        analysis: response,
        recommendations: this.extractRecommendations(response),
        confidence: 0.85, // TODO: Implement confidence scoring
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('AIService: Error calling Ollama', error);
      throw new Error('Failed to analyze pet with AI');
    }
  }

  /**
   * Build the prompt for the AI model
   */
  private buildPrompt(pet: IPet, query: string): string {
    return `
You are a veterinary AI assistant. Analyze the following pet information and answer the question.

## Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed || 'Unknown'}
- Gender: ${pet.gender}
- Birth Date: ${pet.birthdate}
- Weight: ${pet.weight || 'Unknown'} kg
- Vaccinated: ${pet.isVaccinated ? 'Yes' : 'No'}
- Sterilized: ${pet.isSterilized ? 'Yes' : 'No'}

## Medical History:
${pet.medicalReport ? JSON.stringify(pet.medicalReport) : 'No medical history available'}

## Notes:
${pet.notes || 'No additional notes'}

## Question:
${query}

Please provide a detailed analysis and recommendations based on the pet's information and medical history.
`;
  }

  /**
   * Call Ollama API
   */
  private async callOllama(prompt: string): Promise<string> {
    const { host, model } = aiConfig.ollama;
    const { temperature, maxTokens } = aiConfig.settings;

    this.logger.info(`AIService: Calling Ollama at ${host} with model ${model}`);

    try {
      const response = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      this.logger.error('AIService: Failed to call Ollama', error);

      // Return mock response for development/testing
      return this.getMockResponse(prompt);
    }
  }

  /**
   * Extract recommendations from AI response
   */
  private extractRecommendations(response: string): string[] {
    // Simple extraction - look for bullet points or numbered items
    const lines = response.split('\n');
    const recommendations: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        recommendations.push(trimmed.replace(/^[-•*\d.]+\s*/, ''));
      }
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Mock response for development when Ollama is not available
   */
  private getMockResponse(_prompt: string): string {
    return `Based on the provided pet information, the following analysis and recommendations are made`;
  }
}

