import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import type { Model } from 'mongoose';

import { AppModule } from '../src/app.module.js';
import { AuthController } from '../src/modules/auth/auth.controller.js';
import { ClinicController } from '../src/modules/clinic/clinic.controller.js';
import { HealthController } from '../src/modules/health/health.controller.js';
import type { IMedicalReport } from '../src/modules/medical-report/medical-report.entity.js';
import { MongoPetRepositoryAdapter } from '../src/modules/pet/mongo-pet.repository.adapter.js';
import type { PetReportPort } from '../src/modules/pet/pet-report.port.js';
import { PetController } from '../src/modules/pet/pet.controller.js';
import type { IPet } from '../src/modules/pet/pet.entity.js';
import type { PetRepositoryPort } from '../src/modules/pet/pet.repository.port.js';
import { PetService } from '../src/modules/pet/pet.service.js';
import { VeterinarianController } from '../src/modules/veterinarian/veterinarian.controller.js';
import type { ILogger } from '../src/shared/application/logging/logger.interface.js';
import { UserRole } from '../src/shared/auth/auth.types.js';
import type { AuthenticatedUser } from '../src/shared/auth/auth.types.js';
import { IS_PUBLIC_KEY } from '../src/shared/auth/public.decorator.js';
import { ROLES_KEY } from '../src/shared/auth/roles.decorator.js';
import { RolesGuard } from '../src/shared/auth/roles.guard.js';

const clinicId = '64a000000000000000000001';
const anotherClinicId = '64a000000000000000000002';

const userFor = (role: UserRole, userClinicId: string | null = clinicId): AuthenticatedUser => ({
  id: '64a000000000000000000010',
  email: 'user@example.com',
  role,
  clinicId: role === UserRole.PLATFORM_ADMIN ? null : userClinicId,
});

const makeExecutionContext = (
  handler: object,
  controller: object,
  user?: AuthenticatedUser
): ExecutionContext =>
  ({
    getHandler: () => handler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('role access policy', () => {
  const guard = new RolesGuard(new Reflector());

  it('requires authentication globally and leaves only login and health public', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as Array<{
      provide: unknown;
    }>;
    expect(providers.filter(({ provide }) => provide === APP_GUARD)).toHaveLength(2);
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, AuthController.prototype.login)).toBe(true);
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, HealthController.prototype.getHealth)).toBe(true);
    expect(Reflect.getMetadata(ROLES_KEY, AuthController.prototype.createClinicUser)).toEqual([
      UserRole.PLATFORM_ADMIN,
    ]);
  });

  it('allows only the platform admin to use clinic and veterinarian routes', () => {
    const adminOnlyRoutes = [
      { controller: ClinicController, handler: ClinicController.prototype.getClinics },
      {
        controller: VeterinarianController,
        handler: VeterinarianController.prototype.getVeterinarians,
      },
    ];

    for (const { controller, handler } of adminOnlyRoutes) {
      const requiredRoles = Reflect.getMetadata(ROLES_KEY, controller) as UserRole[];
      expect(requiredRoles).toEqual([UserRole.PLATFORM_ADMIN]);

      for (const role of Object.values(UserRole)) {
        const context = makeExecutionContext(handler, controller, userFor(role));
        if (role === UserRole.PLATFORM_ADMIN) {
          expect(guard.canActivate(context)).toBe(true);
        } else {
          expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        }
      }
    }
  });

  it('allows all roles to read pets but only admins to write', () => {
    const readMethods = [
      PetController.prototype.getPets,
      PetController.prototype.getPetById,
      PetController.prototype.getPetReport,
      PetController.prototype.getMedicalReports,
    ];
    const writeMethods = [
      PetController.prototype.createPet,
      PetController.prototype.updatePet,
      PetController.prototype.deletePet,
      PetController.prototype.createMedicalReport,
      PetController.prototype.updateMedicalReport,
      PetController.prototype.deleteMedicalReport,
    ];

    for (const handler of readMethods) {
      const requiredRoles = Reflect.getMetadata(ROLES_KEY, handler) as UserRole[];
      expect(requiredRoles).toEqual(Object.values(UserRole));
      for (const role of Object.values(UserRole)) {
        expect(guard.canActivate(makeExecutionContext(handler, PetController, userFor(role)))).toBe(
          true
        );
      }
    }

    for (const handler of writeMethods) {
      const requiredRoles = Reflect.getMetadata(ROLES_KEY, handler) as UserRole[];
      expect(requiredRoles).toEqual([UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN]);
      expect(
        guard.canActivate(
          makeExecutionContext(handler, PetController, userFor(UserRole.PLATFORM_ADMIN))
        )
      ).toBe(true);
      expect(
        guard.canActivate(
          makeExecutionContext(handler, PetController, userFor(UserRole.CLINIC_ADMIN))
        )
      ).toBe(true);
      expect(() =>
        guard.canActivate(
          makeExecutionContext(handler, PetController, userFor(UserRole.CLINIC_USER))
        )
      ).toThrow(ForbiddenException);
    }
  });
});

describe('clinic-scoped pet access', () => {
  const service = {
    getPets: jest.fn(),
    getPetById: jest.fn(),
    generateClinicalHistoryReport: jest.fn(),
    generateCareReport: jest.fn(),
    getMedicalReports: jest.fn(),
    createMedicalReport: jest.fn(),
    updateMedicalReport: jest.fn(),
    deleteMedicalReport: jest.fn(),
  };
  const controller = new PetController(service as unknown as PetService);

  beforeEach(() => {
    jest.clearAllMocks();
    service.getPetById.mockResolvedValue({});
    service.generateClinicalHistoryReport.mockResolvedValue(Buffer.from('report'));
    service.generateCareReport.mockResolvedValue(Buffer.from('care report'));
    service.getMedicalReports.mockResolvedValue([]);
    service.createMedicalReport.mockResolvedValue({});
    service.updateMedicalReport.mockResolvedValue({});
    service.deleteMedicalReport.mockResolvedValue({});
  });

  it('scopes pet listings and individual pet reads to the caller clinic', async () => {
    const veterinarian = userFor(UserRole.CLINIC_USER);
    const clinicAdmin = userFor(UserRole.CLINIC_ADMIN, anotherClinicId);
    await controller.getPets({}, veterinarian);
    await controller.getPetById({ id: '64a000000000000000000020' }, clinicAdmin);

    expect(service.getPets).toHaveBeenCalledWith({}, clinicId);
    expect(service.getPetById).toHaveBeenCalledWith('64a000000000000000000020', anotherClinicId);
  });

  it('scopes clinical history reports to the caller clinic', async () => {
    const user = userFor(UserRole.CLINIC_USER);
    const response = {
      setHeader: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getPetReport({ id: '64a000000000000000000020' }, response as never, user);

    expect(service.generateClinicalHistoryReport).toHaveBeenCalledWith(
      '64a000000000000000000020',
      clinicId
    );
  });

  it('scopes AI care reports to the caller clinic', async () => {
    const user = userFor(UserRole.CLINIC_USER);
    const response = {
      setHeader: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getPetCareReport({ id: '64a000000000000000000020' }, response as never, user);

    expect(service.generateCareReport).toHaveBeenCalledWith('64a000000000000000000020', clinicId);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.send).toHaveBeenCalledWith(Buffer.from('care report'));
  });

  it('scopes clinical record reads and writes to the caller clinic', async () => {
    const user = userFor(UserRole.CLINIC_ADMIN, anotherClinicId);
    const petParams = { id: '64a000000000000000000020' };
    const reportParams = { ...petParams, reportId: '64a000000000000000000030' };
    const body = {
      veterinarianId: '64a000000000000000000040',
      diagnosis: 'Artritis',
      treatment: 'Seguimiento veterinario',
    };

    await controller.getMedicalReports(petParams, user);
    await controller.createMedicalReport(petParams, body, user);
    await controller.updateMedicalReport(reportParams, body, user);
    await controller.deleteMedicalReport(reportParams, user);

    expect(service.getMedicalReports).toHaveBeenCalledWith(petParams.id, anotherClinicId);
    expect(service.createMedicalReport).toHaveBeenCalledWith(
      petParams.id,
      expect.objectContaining(body),
      anotherClinicId
    );
    expect(service.updateMedicalReport).toHaveBeenCalledWith(
      petParams.id,
      reportParams.reportId,
      expect.objectContaining(body),
      anotherClinicId
    );
    expect(service.deleteMedicalReport).toHaveBeenCalledWith(
      petParams.id,
      reportParams.reportId,
      anotherClinicId
    );
  });

  it('lets the platform admin query all clinics without a clinic filter', async () => {
    const admin = userFor(UserRole.PLATFORM_ADMIN);
    await controller.getPets({}, admin);
    await controller.getPetById({ id: '64a000000000000000000020' }, admin);

    expect(service.getPets).toHaveBeenCalledWith({}, undefined);
    expect(service.getPetById).toHaveBeenCalledWith('64a000000000000000000020', undefined);
  });

  it('rejects clinic-scoped users without a clinic assignment', async () => {
    expect(() => controller.getPets({}, userFor(UserRole.CLINIC_USER, null))).toThrow(
      ForbiddenException
    );
  });
});

describe('Mongo pet repository clinic filters', () => {
  const petQuery = (result: unknown = []) => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  });

  const makeRepository = () => {
    const query = petQuery();
    const medicalReportQuery = petQuery();
    const petId = '64a000000000000000000020';
    const pet = { _id: petId, clinicId };
    const model = {
      find: jest.fn(() => query),
      findOne: jest.fn(() => petQuery(pet)),
      findOneAndUpdate: jest.fn(() => petQuery(pet)),
      findOneAndDelete: jest.fn(() => petQuery(pet)),
      countDocuments: jest.fn(() => ({ exec: jest.fn().mockResolvedValue(0) })),
    };
    const medicalReportModel = {
      find: jest.fn(() => medicalReportQuery),
      deleteMany: jest.fn(() => petQuery()),
    };
    return {
      repository: new MongoPetRepositoryAdapter(
        model as unknown as Model<IPet>,
        medicalReportModel as unknown as Model<IMedicalReport>
      ),
      model,
      query,
      medicalReportModel,
      medicalReportQuery,
    };
  };

  it('applies clinic scope to list and count queries', async () => {
    const { repository, model } = makeRepository();

    await repository.findWithPagination({ page: 1, limit: 10 }, undefined, clinicId);
    await repository.countDocuments(undefined, clinicId);

    expect(model.find).toHaveBeenCalledWith(expect.objectContaining({ clinicId }));
    expect(model.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ clinicId }));
  });

  it('applies clinic scope to individual, history, update, and delete queries', async () => {
    const { repository, model, medicalReportModel, medicalReportQuery } = makeRepository();
    const petId = '64a000000000000000000020';
    const scopedIdQuery = expect.objectContaining({ _id: petId, clinicId });

    await repository.findById(petId, clinicId);
    await repository.findByIdAndPopulate(petId, clinicId);
    await repository.update(petId, {}, clinicId);
    await repository.delete(petId, clinicId);

    expect(model.findOne).toHaveBeenNthCalledWith(1, scopedIdQuery);
    expect(model.findOne).toHaveBeenNthCalledWith(2, scopedIdQuery);
    expect(medicalReportModel.find).toHaveBeenCalledWith({ petId, clinicId });
    expect(medicalReportQuery.populate).toHaveBeenCalledWith({
      path: 'veterinarianId',
      model: 'Veterinarian',
    });
    expect(medicalReportQuery.sort).toHaveBeenCalledWith({ date: -1, _id: -1 });
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(scopedIdQuery, {}, { new: true });
    expect(model.findOneAndDelete).toHaveBeenCalledWith(scopedIdQuery);
    expect(medicalReportModel.deleteMany).toHaveBeenCalledWith({ petId, clinicId });
  });

  it('does not restrict platform-admin queries to one clinic', async () => {
    const { repository, model } = makeRepository();

    await repository.findById('64a000000000000000000020');

    expect(model.findOne).toHaveBeenCalledWith({ _id: '64a000000000000000000020' });
  });
});

describe('cursor pagination clinic filters', () => {
  it('applies the clinic filter to cursor results and their total count', async () => {
    const repository = {
      findWithCursorPagination: jest.fn().mockResolvedValue({
        data: [],
        pagination: {
          nextCursor: null,
          previousCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }),
      countDocuments: jest.fn().mockResolvedValue(0),
    };
    const service = new PetService(
      { info: jest.fn() } as unknown as ILogger,
      repository as unknown as PetRepositoryPort,
      { generateReport: jest.fn() } as unknown as PetReportPort,
      {} as never,
      { analyzePet: jest.fn() } as never
    );

    await service.getPets({ cursor: '' }, clinicId);

    expect(repository.findWithCursorPagination).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: '' }),
      {},
      clinicId
    );
    expect(repository.countDocuments).toHaveBeenCalledWith({}, clinicId);
  });
});
