import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';

import {
  PaginationParams,
  CursorPaginationParams,
  PaginatedResponse,
  CursorPaginatedResponse,
  calculateSkip,
  calculateTotalPages,
} from '../../shared/utils/pagination/pagination.util.js';
import type { IMedicalReport } from '../medical-report/medical-report.entity.js';

import type { IPet } from './pet.entity.js';
import type { PetFilters, PetRepositoryPort } from './pet.repository.port.js';

@Injectable()
export class MongoPetRepositoryAdapter implements PetRepositoryPort {
  constructor(
    @InjectModel('Pet') private readonly petModel: Model<IPet>,
    @InjectModel('MedicalReport') private readonly medicalReportModel: Model<IMedicalReport>
  ) {}

  private buildFilterQuery(filters?: PetFilters): FilterQuery<IPet> {
    const query: FilterQuery<IPet> = {};

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

  public async countDocuments(filters?: PetFilters, clinicId?: string): Promise<number> {
    const query = this.buildFilterQuery(filters);
    if (clinicId) query.clinicId = clinicId;
    return await this.petModel.countDocuments(query).exec();
  }

  public async findWithPagination(
    params: PaginationParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<PaginatedResponse<IPet>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const query = this.buildFilterQuery(filters);
    if (clinicId) query.clinicId = clinicId;
    const skip = calculateSkip(page, limit);
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.petModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.petModel.countDocuments(query).exec(),
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
        hasPreviousPage: page > 1,
      },
    };
  }

  public async findWithCursorPagination(
    params: CursorPaginationParams,
    filters?: PetFilters,
    clinicId?: string
  ): Promise<CursorPaginatedResponse<IPet>> {
    const { cursor, limit = 10, sortBy = '_id', sortOrder = 'desc' } = params;

    const query = this.buildFilterQuery(filters);
    if (clinicId) query.clinicId = clinicId;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    if (cursor) {
      const cursorCondition = sortOrder === 'asc' ? { $gt: cursor } : { $lt: cursor };
      query[sortBy] = cursorCondition;
    }

    const data = await this.petModel
      .find(query)
      .sort({ [sortBy]: sortDirection })
      .limit(limit + 1)
      .exec();

    const hasNextPage = data.length > limit;
    const items = hasNextPage ? data.slice(0, limit) : data;

    const nextCursor =
      hasNextPage && items.length > 0
        ? items[items.length - 1].get(sortBy)?.toString() || null
        : null;

    return {
      data: items as IPet[],
      pagination: {
        nextCursor,
        previousCursor: cursor || null,
        hasNextPage,
        hasPreviousPage: !!cursor,
      },
    };
  }

  public async findAll(): Promise<IPet[]> {
    const pets = await this.petModel.find().exec();
    return pets as IPet[];
  }

  public async findById(id: string, clinicId?: string): Promise<IPet | null> {
    const pet = await this.petModel.findOne({ _id: id, ...(clinicId ? { clinicId } : {}) }).exec();
    return pet as IPet | null;
  }

  public async findByIdAndPopulate(id: string, clinicId?: string): Promise<IPet | null> {
    const pet = await this.petModel.findOne({ _id: id, ...(clinicId ? { clinicId } : {}) }).exec();
    if (!pet) return null;
    const medicalReports = await this.medicalReportModel
      .find({ petId: pet._id, clinicId: pet.clinicId })
      .populate({ path: 'veterinarianId', model: 'Veterinarian' })
      .sort({ date: -1, _id: -1 })
      .exec();
    pet.medicalReport = medicalReports;
    return pet as IPet | null;
  }

  public async create(petData: Partial<IPet>): Promise<IPet> {
    const pet = new this.petModel(petData);
    const savedPet = await pet.save();
    return savedPet as IPet;
  }

  public async update(id: string, petData: Partial<IPet>, clinicId?: string): Promise<IPet | null> {
    const updatedPet = await this.petModel
      .findOneAndUpdate({ _id: id, ...(clinicId ? { clinicId } : {}) }, petData, { new: true })
      .exec();
    return updatedPet as IPet | null;
  }

  public async delete(id: string, clinicId?: string): Promise<IPet | null> {
    const deletedPet = await this.petModel
      .findOneAndDelete({
        _id: id,
        ...(clinicId ? { clinicId } : {}),
      })
      .exec();
    if (deletedPet) {
      await this.medicalReportModel
        .deleteMany({ petId: deletedPet._id, clinicId: deletedPet.clinicId })
        .exec();
    }
    return deletedPet as IPet | null;
  }

  public async findPetsByClinicId(clinicId: string): Promise<IPet[]> {
    const pets = await this.petModel.find({ clinicId }).exec();
    return pets as IPet[];
  }
}
