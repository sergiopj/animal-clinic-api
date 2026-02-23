import {ILogger} from '../../shared/application/logging/logger.interface.js';
import { 
    PaginatedResponseDTO, 
    CursorPaginatedResponseDTO 
} from '../../shared/utils/pagination/paginated-response.dto.js';
import { PaginationParams, CursorPaginationParams } from '../../shared/utils/pagination/pagination.util.js';
import { PetQueryParams } from './dto/Request/query-pet.dto.js';
import { ResponsePetDTO } from './dto/Response/response-pet.dto.js';
import { IPetRepository, PetFilters } from './interfaces/Pet.interface.js';
import { IPet } from './pet.entity.js';
import { PetGenderEnum, PetSpeciesEnum } from './pet.index.js';

export class PetService {
    constructor(
        private logger: ILogger,
        private petRepository: IPetRepository
    ) {}
 
    private toResponseDTO(pet: IPet): ResponsePetDTO {
        return {
            _id: (pet as any)._id.toString(),
            name: pet.name,
            breed: pet.breed,
            species: pet.species,
            gender: pet.gender,
            birthdate: pet.birthdate,
            weight: pet.weight,            
            color: pet.color,
            notes: pet.notes,
            isVaccinated: pet.isVaccinated,
            isSterilized: pet.isSterilized,
            clinicId: pet.clinicId.toString(),
            createdAt: pet.createdAt || new Date(),
            updatedAt: pet.updatedAt || new Date(),
        };
    }  

    private toResponseWithClinicalHistoryDTO(pet: IPet): ResponsePetDTO {
        const petDTO = this.toResponseDTO(pet);
        if (pet.medicalReport && pet.medicalReport.length > 0) {
            petDTO.medicalReport = pet.medicalReport.map((report: any) => {
                const reportDTO = {
                    ...report.toObject(),
                    _id: report._id.toString(),
                    petId: report.petId.toString(),
                    clinicId: report.clinicId.toString(),
                    veterinarianId: {
                        ...report.veterinarianId.toObject(),
                        _id: report.veterinarianId._id.toString(),
                    }
                };
                return reportDTO;
            });
        }
        return petDTO;
    }


    public async getPetById(id: string): Promise<ResponsePetDTO | null> {
        this.logger.info(`PetService: Fetching pet with id: ${id}`);
        const pet = await this.petRepository.findById(id);
        if (!pet) return null;
        return this.toResponseDTO(pet);
    }

    public async getPetWithClinicalHistory(id: string): Promise<ResponsePetDTO | null> {
        this.logger.info(`PetService: Fetching pet with clinical history for id: ${id}`);
        const pet = await this.petRepository.findByIdAndPopulate(id);
        if (!pet) return null;
        return this.toResponseWithClinicalHistoryDTO(pet);
    }

    public async addPet(petData: IPet): Promise<ResponsePetDTO> {
        this.logger.info('PetService: Adding a new pet');
        const created = await this.petRepository.create(petData as Partial<IPet>);
        return this.toResponseDTO(created);
    }

    public async updatePet(id: string, petData: IPet): Promise<ResponsePetDTO | null> {
        this.logger.info(`PetService: Updating pet with id: ${id}`);
        const updated = await this.petRepository.update(id, petData as Partial<IPet>);
        if (!updated) return null;
        return this.toResponseDTO(updated);
    }

    public async deletePet(id: string): Promise<ResponsePetDTO | null> {
        this.logger.info(`PetService: Deleting pet with id: ${id}`);
        const deleted = await this.petRepository.delete(id);
        if (!deleted) return null;
        return this.toResponseDTO(deleted);
    }

   

    public async getPetsByClinicId(clinicId: string): Promise<any[]> {
        this.logger.info(`PetService: Fetching pets for clinic with id: ${clinicId}`);
        return this.petRepository.findPetsByClinicId(clinicId);  
    }

    private extractFiltersFromQuery(query: PetQueryParams): PetFilters {
        const filters: PetFilters = {};
        
        if (query.name) filters.name = query.name as string;
        if (query.species) filters.species = query.species as PetSpeciesEnum;
        if (query.gender) filters.gender = query.gender as PetGenderEnum;
        
        return filters;
    }
  
    public async getPets(
        query: PetQueryParams
    ): Promise<PaginatedResponseDTO<ResponsePetDTO> | CursorPaginatedResponseDTO<ResponsePetDTO>> {
        const filters = this.extractFiltersFromQuery(query);
        const hasCursor = query.cursor !== undefined;
        
        if (hasCursor) {
            this.logger.info('PetService: Using cursor-based pagination');
            return this.getCursorPaginatedPets(query, filters);
        } else {
            this.logger.info('PetService: Using offset-based pagination');
            return this.getPaginatedPets(query, filters);
        }
    }

    private async getPaginatedPets(
        query: PetQueryParams,
        filters?: PetFilters
    ): Promise<PaginatedResponseDTO<ResponsePetDTO>> {
        const params: PaginationParams = {
            page: query.page ? (typeof query.page === 'number' ? query.page : parseInt(query.page)) : 1,
            limit: query.limit ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit)) : 10,
            sortBy: query.sortBy || 'createdAt',
            sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc'
        };
        
        this.logger.info('PetService: Fetching pets with pagination', { params, filters });
        
        const result = await this.petRepository.findWithPagination(params, filters);
        
        return {
            data: result.data.map(pet => this.toResponseDTO(pet)),
            pagination: result.pagination
        };
    }

    private async getCursorPaginatedPets(
        query: PetQueryParams,
        filters?: PetFilters
    ): Promise<CursorPaginatedResponseDTO<ResponsePetDTO>> {
        const params: CursorPaginationParams = {
            cursor: query.cursor || '',
            limit: query.limit ? Math.min(100, typeof query.limit === 'number' ? query.limit : parseInt(query.limit)) : 10,
            sortBy: query.sortBy || '_id',
            sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc'
        };
        
        this.logger.info('PetService: Fetching pets with cursor pagination', { params, filters });
        
        const result = await this.petRepository.findWithCursorPagination(params, filters);
        
        let total: number | undefined;
        if (params.cursor === undefined || params.cursor === '') {
            total = await this.petRepository.countDocuments(filters);
        }
        
        return {
            data: result.data.map(pet => this.toResponseDTO(pet)),
            pagination: {
                ...result.pagination,
                total
            }
        };
    }

}
