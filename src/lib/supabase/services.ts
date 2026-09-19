import { createClient } from './client';

export const supabase = createClient();

// ==========================================
// 1. SERVICE AUTHENTIFICATION
// ==========================================
export const authService = {
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    } catch (err) {
      console.warn('Supabase Auth Notice:', err);
      return null;
    }
  },

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) return null;
      return data;
    } catch {
      return null;
    }
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },
};

// ==========================================
// 2. SERVICE ÉLÈVES (STUDENTS)
// ==========================================
export const studentService = {
  async getAll(schoolId?: string) {
    try {
      let query = supabase.from('students').select('*, current_class:classrooms(*)');
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data, error } = await query;
      if (error) return null;
      return data || [];
    } catch {
      return null;
    }
  },

  async create(studentData: any) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase Student Create Notice:', err);
      return null;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  },
};

// ==========================================
// 3. SERVICE ENCAISSEMENTS & PAIEMENTS (PAYMENTS)
// ==========================================
export const paymentService = {
  async getAll(schoolId?: string) {
    try {
      let query = supabase
        .from('payments')
        .select('*, student:students(first_name, last_name, matricule)')
        .order('paid_at', { ascending: false });
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data, error } = await query;
      if (error) return null;
      return data || [];
    } catch {
      return null;
    }
  },

  async recordPayment(paymentData: {
    school_id?: string;
    student_id: string;
    amount: number;
    method: 'WAVE' | 'ORANGE_MONEY' | 'CASH' | 'FREE_MONEY' | 'BANK_TRANSFER';
    receipt_number: string;
    transaction_ref?: string;
    note?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            ...paymentData,
            status: 'COMPLETED',
            paid_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase Record Payment Notice:', err);
      return null;
    }
  },
};

// ==========================================
// 4. SERVICE NOTES & ABSENCES
// ==========================================
export const gradeService = {
  async getStudentGrades(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*, subject:subjects(name, code)')
        .eq('student_id', studentId);
      if (error) return null;
      return data || [];
    } catch {
      return null;
    }
  },

  async addGrade(gradeData: {
    student_id: string;
    subject_id: string;
    title: string;
    score: number;
    max_score?: number;
    term?: string;
    comment?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert([gradeData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },
};

export const attendanceService = {
  async markAttendance(attendanceRecords: Array<{
    school_id?: string;
    classroom_id: string;
    student_id: string;
    date?: string;
    status: 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';
    reason?: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .upsert(attendanceRecords)
        .select();
      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },
};

