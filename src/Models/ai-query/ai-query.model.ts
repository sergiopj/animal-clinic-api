export interface AIQueryModel {
  petId: number;
  query: string;
  context?: string;
}

// TODO crear recomendaciones entidad etc
export interface AIResponseModel {
  petId: number;
  petName: string;
  query: string;
  analysis: string;
  recommendations?: string[];
  confidence?: number;
  timestamp: Date;
}

