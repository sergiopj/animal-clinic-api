import Clinic from './clinic.entity.js';
import Vet from '../veterinarian/veterinarian.entity.js';
import Pet from '../pet/pet.entity.js';
import type { IClinic } from './clinic.entity.js';
import type { IVeterinarian } from '../veterinarian/veterinarian.entity.js';
import type { IPet } from '../pet/pet.entity.js';
import { IClinicRepository, ClinicFilters } from './interfaces/Clinic.interface.js';
import { 
    PaginationParams, 
    CursorPaginationParams, 
    PaginatedResponse, 
    CursorPaginatedResponse,
    calculateSkip,
    calculateTotalPages
} from '../../shared/utils/pagination/pagination.util.js';

export class ClinicRepository implements IClinicRepository {
    
    private buildFilterQuery(filters?: ClinicFilters): any {
        const query: any = {};
        
        if (!filters) return query;
        
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' }; // Case-insensitive search
        }
        
        if (filters.city) {
            query['address.city'] = { $regex: filters.city, $options: 'i' };
        }
        
        if (filters.country) {
            query['address.country'] = { $regex: filters.country, $options: 'i' };
        }
        
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        
        return query;
    }

    public async countDocuments(filters?: ClinicFilters): Promise<number> {
        const query = this.buildFilterQuery(filters);
        return await Clinic.countDocuments(query).exec();
    }

    public async findWithPagination(
        params: PaginationParams,
        filters?: ClinicFilters
    ): Promise<PaginatedResponse<IClinic>> {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        
        const query = this.buildFilterQuery(filters);
        const skip = calculateSkip(page, limit);
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        
        // Execute queries in parallel
        const [data, total] = await Promise.all([
            Clinic.find(query)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .populate('veterinarians')
                .populate('pets')
                .exec(),
            Clinic.countDocuments(query).exec()
        ]);
        
        const totalPages = calculateTotalPages(total, limit);
        
        return {
            data: data as IClinic[],
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
        filters?: ClinicFilters
    ): Promise<CursorPaginatedResponse<IClinic>> {
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
        const data = await Clinic.find(query)
            .sort({ [sortBy]: sortDirection })
            .limit(limit + 1)
            .populate('veterinarians')
            .populate('pets')
            .exec();
        
        const hasNextPage = data.length > limit;
        const items = hasNextPage ? data.slice(0, limit) : data;
        
        const nextCursor = hasNextPage && items.length > 0
            ? (items[items.length - 1] as any)[sortBy]?.toString() || null
            : null;
        
        const previousCursor = cursor || null;
        
        return {
            data: items as IClinic[],
            pagination: {
                nextCursor,
                previousCursor,
                hasNextPage,
                hasPreviousPage: !!cursor
            }
        };
    }
    
    public async findAll(): Promise<IClinic[]> {
        const clinics = await Clinic.find()
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return clinics as IClinic[];
    }

    public async findById(id: string): Promise<IClinic | null> {
        const clinic = await Clinic.findById(id)
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return clinic as IClinic | null;
    }

    public async create(clinicData: Partial<IClinic>): Promise<IClinic> {
        const clinic = new Clinic(clinicData);
        const savedClinic = await clinic.save();
        return savedClinic as IClinic;
    }

    public async update(id: string, clinicData: Partial<IClinic>): Promise<IClinic | null> {
        const updatedClinic = await Clinic.findByIdAndUpdate(id, clinicData, { new: true })
            .populate('veterinarians')
            .populate('pets')
            .exec();
        return updatedClinic as IClinic | null;
    }

    public async delete(id: string): Promise<IClinic | null> {
        const deletedClinic = await Clinic.findByIdAndDelete(id).exec();
        return deletedClinic as IClinic | null;
    }

    public async findVeterinariansByClinicId(clinicId: string): Promise<IVeterinarian[]> {
        const vets = await Vet.find({ clinicId }).exec();
        return vets as IVeterinarian[];
    }

    public async findPetsByClinicId(clinicId: string): Promise<IPet[]> {
        const pets = await Pet.find({ clinicId }).exec();
        return pets as IPet[];
    }
}
