import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';

import type { IVeterinarian } from '../veterinarian/veterinarian.entity.js';

import type { IMedicalReport } from './medical-report.entity.js';
import type {
  MedicalReportRepositoryPort,
  MedicalReportWriteData,
} from './medical-report.repository.port.js';

@Injectable()
export class MongoMedicalReportRepositoryAdapter implements MedicalReportRepositoryPort {
  constructor(
    @InjectModel('MedicalReport') private readonly reportModel: Model<IMedicalReport>,
    @InjectModel('Veterinarian') private readonly veterinarianModel: Model<IVeterinarian>
  ) {}

  public async findByPetId(
    petId: Types.ObjectId,
    clinicId: Types.ObjectId
  ): Promise<IMedicalReport[]> {
    return this.reportModel
      .find({ petId, clinicId })
      .populate({ path: 'veterinarianId', model: 'Veterinarian' })
      .sort({ date: -1, _id: -1 })
      .exec();
  }

  public async veterinarianBelongsToClinic(
    veterinarianId: string,
    clinicId: Types.ObjectId
  ): Promise<boolean> {
    return Boolean(await this.veterinarianModel.exists({ _id: veterinarianId, clinicId }).exec());
  }

  public async create(
    petId: Types.ObjectId,
    clinicId: Types.ObjectId,
    data: MedicalReportWriteData
  ): Promise<IMedicalReport> {
    const report = await this.reportModel.create({
      petId,
      clinicId,
      veterinarianId: data.veterinarianId,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      date: data.date,
    });
    await report.populate({ path: 'veterinarianId', model: 'Veterinarian' });
    return report;
  }

  public async update(
    id: string,
    petId: Types.ObjectId,
    clinicId: Types.ObjectId,
    data: MedicalReportWriteData
  ): Promise<IMedicalReport | null> {
    return this.reportModel
      .findOneAndUpdate(
        { _id: id, petId, clinicId },
        {
          veterinarianId: data.veterinarianId,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          date: data.date,
        },
        { new: true, runValidators: true }
      )
      .populate({ path: 'veterinarianId', model: 'Veterinarian' })
      .exec();
  }

  public async delete(
    id: string,
    petId: Types.ObjectId,
    clinicId: Types.ObjectId
  ): Promise<IMedicalReport | null> {
    return this.reportModel
      .findOneAndDelete({ _id: id, petId, clinicId })
      .populate({ path: 'veterinarianId', model: 'Veterinarian' })
      .exec();
  }
}
