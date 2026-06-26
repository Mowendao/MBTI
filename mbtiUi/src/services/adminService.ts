import type {
  User,
  AssessmentType,
  PersonalityDimension,
  TestSchedule,
  TestTaker,
  AdminTestResult,
  Batch,
} from '@/types/mbti';
import api from './api';

// ===== 用户管理 =====
export const adminUserService = {
  async getAll(): Promise<User[]> {
    const res = await api.get('/admin/users');
    return res.data.data;
  },

  async getById(id: string): Promise<User> {
    const res = await api.get(`/admin/users/${id}`);
    return res.data.data;
  },

  async save(user: User): Promise<User> {
    if (user.id) {
      const res = await api.put(`/admin/users/${user.id}`, user);
      return res.data.data;
    } else {
      const res = await api.post('/admin/users', user);
      return res.data.data;
    }
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};

// ===== 考核类型管理 =====
export const assessmentTypeService = {
  async getAll(): Promise<AssessmentType[]> {
    const res = await api.get('/admin/assessment-types');
    return res.data.data;
  },

  async save(type: AssessmentType): Promise<AssessmentType> {
    if (type.id) {
      const res = await api.put(`/admin/assessment-types/${type.id}`, type);
      return res.data.data;
    } else {
      const res = await api.post('/admin/assessment-types', type);
      return res.data.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/assessment-types/${id}`);
  },
};

// ===== 性格维度管理 =====
export const dimensionService = {
  async getAll(): Promise<PersonalityDimension[]> {
    const res = await api.get('/admin/dimensions');
    return res.data.data;
  },

  async save(dim: PersonalityDimension): Promise<PersonalityDimension> {
    if (dim.id) {
      const res = await api.put(`/admin/dimensions/${dim.id}`, dim);
      return res.data.data;
    } else {
      const res = await api.post('/admin/dimensions', dim);
      return res.data.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/dimensions/${id}`);
  },

  getCategories(): string[] {
    return ['EI', 'SN', 'TF', 'JP'];
  },
};

// ===== 批次管理 =====
export const batchService = {
  async getAll(): Promise<Batch[]> {
    const res = await api.get('/admin/batches');
    return res.data.data;
  },

  async save(batch: Batch): Promise<Batch> {
    if (batch.id) {
      const res = await api.put(`/admin/batches/${batch.id}`, batch);
      return res.data.data;
    } else {
      const res = await api.post('/admin/batches', batch);
      return res.data.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/batches/${id}`);
  },
};

// ===== 测试安排管理 =====
export const scheduleService = {
  async getAll(): Promise<TestSchedule[]> {
    const res = await api.get('/admin/schedules');
    return res.data.data;
  },

  async save(schedule: TestSchedule): Promise<TestSchedule> {
    if (schedule.id) {
      const res = await api.put(`/admin/schedules/${schedule.id}`, schedule);
      return res.data.data;
    } else {
      const res = await api.post('/admin/schedules', schedule);
      return res.data.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/schedules/${id}`);
  },
};

// ===== 参测人员管理 =====
export const testTakerService = {
  async getAll(): Promise<TestTaker[]> {
    const res = await api.get('/admin/test-takers');
    return res.data.data;
  },

  async save(taker: TestTaker): Promise<TestTaker> {
    if (taker.id) {
      const res = await api.put(`/admin/test-takers/${taker.id}`, taker);
      return res.data.data;
    } else {
      const res = await api.post('/admin/test-takers', taker);
      return res.data.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/test-takers/${id}`);
  },
};

// ===== 测试结果管理 =====
export const adminTestResultService = {
  async getAll(): Promise<AdminTestResult[]> {
    const res = await api.get('/admin/analysis/results');
    return res.data.data;
  },

  async getStats(): Promise<{ total: number; completed: number; typeDistribution: Record<string, number> }> {
    const res = await api.get('/admin/analysis/stats');
    return res.data.data;
  },
};
