// apps/api/src/prep/prep.service.spec.ts
import { PrepService } from './prep.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PrepService', () => {
  let service: PrepService;

  const mockPrisma = {
    prepCourse: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    service = new PrepService(mockPrisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create and return a course', async () => {
      const data = { title: 'Test Course', roleId: 'role1' } as any;
      const created = { id: 'c1', ...data } as any;
      mockPrisma.prepCourse.create.mockResolvedValue(created);

      const result = await service.createCourse(data);
      expect(mockPrisma.prepCourse.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(created);
    });

    it('should throw BadRequestException on failure', async () => {
      const data = {} as any;
      mockPrisma.prepCourse.create.mockRejectedValue(new Error('db error'));
      await expect(service.createCourse(data)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getCourses (pagination)', () => {
    it('should return paginated courses', async () => {
      const params = { skip: 10, take: 5, roleId: 'role1' };
      const courses = [{ id: 'c1' }, { id: 'c2' }];
      mockPrisma.prepCourse.findMany.mockResolvedValue(courses);

      const result = await service.getCourses(params);
      expect(mockPrisma.prepCourse.findMany).toHaveBeenCalledWith({
        where: { roleId: 'role1' },
        skip: 10,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(courses);
    });
  });

  describe('updateCourse', () => {
    it('should update and return the course', async () => {
      const id = 'c1';
      const data = { title: 'Updated Title' } as any;
      const updated = { id, ...data } as any;
      mockPrisma.prepCourse.update.mockResolvedValue(updated);

      const result = await service.updateCourse(id, data);
      expect(mockPrisma.prepCourse.update).toHaveBeenCalledWith({ where: { id }, data });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when update fails', async () => {
      const id = 'nonexistent';
      const data = {} as any;
      mockPrisma.prepCourse.update.mockRejectedValue(new Error('not found'));
      await expect(service.updateCourse(id, data)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteCourse', () => {
    it('should delete and return the course', async () => {
      const id = 'c1';
      const deleted = { id } as any;
      mockPrisma.prepCourse.delete.mockResolvedValue(deleted);

      const result = await service.deleteCourse(id);
      expect(mockPrisma.prepCourse.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(deleted);
    });

    it('should throw NotFoundException when delete fails', async () => {
      const id = 'nonexistent';
      mockPrisma.prepCourse.delete.mockRejectedValue(new Error('not found'));
      await expect(service.deleteCourse(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
