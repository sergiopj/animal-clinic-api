import dotenv from 'dotenv';

dotenv.config();

export const aiConfig = {
  ollama: {
    host: process.env.OLLAMA_HOST || 'http://ollama:11434',
    model: process.env.OLLAMA_MODEL || 'llama2',
  },
  settings: {
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000', 10),
  },
};

export default aiConfig;
