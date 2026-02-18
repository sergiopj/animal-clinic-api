import { injectable, inject } from 'tsyringe';
import { ILogger } from '../application/interfaces/ILogger.js';
import { aiConfig } from '../config/ai.config.js';
import { AIResponseDTO } from '../models/dto/ai-query.dto.js';
import Pet from '../models/entities/Pet.js';

// <--- 3. THE HEART: Logic for LangChain/Ollama
@injectable()
export class AIService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * Analyze pet data with AI using Ollama
   */
  public async analyzePet(pet: Pet, query: string): Promise<AIResponseDTO> {
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
  private buildPrompt(pet: Pet, query: string): string {
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
${pet.medicalHistory || 'No medical history available'}

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
    return `
Based on the pet information provided, here is my analysis:

1. The pet appears to be in generally good health based on the available records.
2. Regular check-ups are recommended to maintain optimal health.
3. Ensure vaccinations are up to date according to the schedule.

Recommendations:
- Schedule a wellness exam within the next month
- Maintain a balanced diet appropriate for the pet's age and species
- Regular exercise is important for overall health
- Monitor for any changes in behavior or appetite

Note: This is an AI-generated analysis. Always consult with a licensed veterinarian for medical decisions.
`;
  }
}

