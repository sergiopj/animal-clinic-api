export interface AIQueryDTO {
  petId: number;
  query: string;
  context?: string;
}

// TODO crear recomendaciones entidad etc
export interface AIResponseDTO {
  petId: number;
  petName: string;
  query: string;
  analysis: string;
  recommendations?: string[];
  confidence?: number;
  timestamp: Date;
}

