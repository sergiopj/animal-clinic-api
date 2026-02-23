import Pet from './pet.entity.js';
import type { IPet } from './pet.entity.js';
import { 
    PaginationParams, 
    CursorPaginationParams, 
    PaginatedResponse, 
    CursorPaginatedResponse,
    calculateSkip,
    calculateTotalPages
} from '../../shared/utils/pagination/pagination.util.js';
import { IPetRepository, PetFilters } from './interfaces/Pet.interface.js';

export class PetRepository implements IPetRepository {
    
    private buildFilterQuery(filters?: PetFilters): any {
        const query: any = {};
        
        if (!filters) return query;
        
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' }; // Case-insensitive search
        }        
              
        if (filters.species) {
            query.species = { $regex: filters.species, $options: 'i' };
        }

        if (filters.gender) {
            query.gender = { $regex: filters.gender, $options: 'i' };
        }       
        
        return query;
    }

    public async countDocuments(filters?: PetFilters): Promise<number> {
        const query = this.buildFilterQuery(filters);
        return await Pet.countDocuments(query).exec();
    }

    public async findWithPagination(
        params: PaginationParams,
        filters?: PetFilters
    ): Promise<PaginatedResponse<IPet>> {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        
        const query = this.buildFilterQuery(filters);
        const skip = calculateSkip(page, limit);
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        
        // Execute queries in parallel
        const [data, total] = await Promise.all([
            Pet.find(query)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .exec(),
            Pet.countDocuments(query).exec()
        ]);
        
        const totalPages = calculateTotalPages(total, limit);
        
        return {
            data: data as IPet[],
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }

    public async findWithCursorPagination(
        params: CursorPaginationParams,
        filters?: PetFilters
    ): Promise<CursorPaginatedResponse<IPet>> {
        const { cursor, limit = 10, sortBy = '_id', sortOrder = 'desc' } = params;
        
        const query = this.buildFilterQuery(filters);
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        
        // Add cursor condition to query
        if (cursor) {
            const cursorCondition = sortOrder === 'asc' 
                ? { $gt: cursor } 
                : { $lt: cursor };
            query[sortBy] = cursorCondition;
        }
        
        // Fetch limit + 1 to determine if there's a next page
        const data = await Pet.find(query)
            .sort({ [sortBy]: sortDirection })
            .limit(limit + 1)
            .exec();
        
        const hasNextPage = data.length > limit;
        const items = hasNextPage ? data.slice(0, limit) : data;
        
        const nextCursor = hasNextPage && items.length > 0
            ? (items[items.length - 1] as any)[sortBy]?.toString() || null
            : null;
        
        const previousCursor = cursor || null;
        
        return {
            data: items as IPet[],
            pagination: {
                nextCursor,
                previousCursor,
                hasNextPage,
                hasPreviousPage: !!cursor
            }
        };
    }
    
    public async findAll(): Promise<IPet[]> {
        const pets = await Pet.find().exec();
        return pets as IPet[];
    }

    public async findById(id: string): Promise<IPet | null> {
        const pet = await Pet.findById(id)
            .exec();
        return pet as IPet | null;
    }

    public async findByIdAndPopulate(id: string): Promise<IPet | null> {
        const pet = await Pet.findById(id)
            .populate({
                path: 'medicalReport',
                populate: {
                    path: 'veterinarianId',
                    model: 'Veterinarian'
                }
            })
            .exec();
        return pet as IPet | null;
    }

    public async create(petData: Partial<IPet>): Promise<IPet> {
        const pet = new Pet(petData);
        const savedPet = await pet.save();
        return savedPet as IPet;
    }

    public async update(id: string, petData: Partial<IPet>): Promise<IPet | null> {
        const updatedPet = await Pet.findByIdAndUpdate(id, petData, { new: true }).exec();
        return updatedPet as IPet | null;
    }

    public async delete(id: string): Promise<IPet | null> {
        const deletedPet = await Pet.findByIdAndDelete(id).exec();
        return deletedPet as IPet | null;
    }    

    public async findPetsByClinicId(clinicId: string): Promise<IPet[]> {
        const pets = await Pet.find({ clinicId }).exec();
        return pets as IPet[];
    }

    public findPetsByClinicIdn(clinicId: string): Promise<IPet[]> {
        return Pet.find({ clinicId }).exec() as Promise<IPet[]>;
    }

}