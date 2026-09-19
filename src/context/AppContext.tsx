'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, Student, Parent, Teacher, Classroom, Subject, 
  PaymentRecord, StudentFee, AttendanceRecord, AttendanceStatus,
  ReportCard, HomeworkItem, NotificationItem, School, TimetableSlot,
  PromotionRecord
} from '@/types';
import { 
  DEMO_SCHOOL, DEMO_STUDENTS, DEMO_PARENTS, DEMO_TEACHERS, 
  DEMO_CLASSES, DEMO_SUBJECTS, DEMO_PAYMENTS, DEMO_OVERDUE_FEES, 
  DEMO_ATTENDANCES, DEMO_REPORT_CARD_AWA, DEMO_HOMEWORK, DEMO_NOTIFICATIONS,
  DEMO_ALL_TIMETABLE_SLOTS, DEMO_PROMOTIONS
} from '@/lib/mock-data';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentSchool: School;
  updateSchool: (data: Partial<School>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'matricule'> & { matricule?: string }) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  parents: Parent[];
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  classes: Classroom[];
  subjects: Subject[];
  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'paidAt'>) => PaymentRecord;
  overdueFees: StudentFee[];
  attendances: AttendanceRecord[];
  updateAttendance: (id: string, status: AttendanceStatus, reason?: string) => void;
  markBatchAttendance: (records: { studentId: string; status: AttendanceStatus }[]) => void;
  homeworks: HomeworkItem[];
  addHomework: (hw: Omit<HomeworkItem, 'id' | 'assignedDate'>) => void;
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  currentParentChildId: string;
  setCurrentParentChildId: (childId: string) => void;
  activeReportCard: ReportCard;
  timetables: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => { success: boolean; error?: string };
  deleteTimetableSlot: (id: string) => void;
  promotions: PromotionRecord[];
  updatePromotion: (id: string, data: Partial<PromotionRecord>) => void;
  publishAllPromotions: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('SCHOOL_ADMIN');
  const [currentSchool, setCurrentSchool] = useState<School>(DEMO_SCHOOL);
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [parents, setParents] = useState<Parent[]>(DEMO_PARENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(DEMO_TEACHERS);
  const [classes, setClasses] = useState<Classroom[]>(DEMO_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(DEMO_SUBJECTS);
  const [payments, setPayments] = useState<PaymentRecord[]>(DEMO_PAYMENTS);
  const [overdueFees, setOverdueFees] = useState<StudentFee[]>(DEMO_OVERDUE_FEES);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(DEMO_ATTENDANCES);
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(DEMO_HOMEWORK);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [currentParentChildId, setCurrentParentChildId] = useState<string>('stu-1');
  const [activeReportCard, setActiveReportCard] = useState<ReportCard>(DEMO_REPORT_CARD_AWA);
  const [timetables, setTimetables] = useState<TimetableSlot[]>(DEMO_ALL_TIMETABLE_SLOTS);
  const [promotions, setPromotions] = useState<PromotionRecord[]>(DEMO_PROMOTIONS);

  const updateSchool = (data: Partial<School>) => {
    setCurrentSchool(prev => ({ ...prev, ...data }));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'matricule'> & { matricule?: string }) => {
    const nextNum = students.length + 12;
    const matricule = studentData.matricule || `EIS-2025-${nextNum.toString().padStart(4, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      matricule,
      feeBalance: studentData.totalFees - studentData.paidFees,
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
    };
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'paidAt'>): PaymentRecord => {
    const nextReceiptNum = payments.length + 436;
    const receiptNumber = `REC-2024-${nextReceiptNum.toString().padStart(5, '0')}`;
    const now = new Date();
    const paidAt = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber,
      paidAt,
    };

    setPayments(prev => [newPayment, ...prev]);

    // Déduire du solde de l'élève
    setStudents(prev => prev.map(s => {
      if (s.id === paymentData.studentId) {
        const newPaid = s.paidFees + paymentData.amount;
        const newBalance = Math.max(0, s.totalFees - newPaid);
        return {
          ...s,
          paidFees: newPaid,
          feeBalance: newBalance,
        };
      }
      return s;
    }));

    // Mettre à jour les impayés si présent
    setOverdueFees(prev => prev.map(f => {
      if (f.studentId === paymentData.studentId) {
        const newPaid = f.paidAmount + paymentData.amount;
        const newDue = Math.max(0, f.totalAmount - newPaid);
        return {
          ...f,
          paidAmount: newPaid,
          dueAmount: newDue,
          isOverdue: newDue > 0,
        };
      }
      return f;
    }).filter(f => f.dueAmount > 0));

    // Ajouter notification
    addNotification({
      title: 'Nouveau Paiement Enregistré',
      message: `Reçu ${receiptNumber} de ${paymentData.amount.toLocaleString()} FCFA pour ${paymentData.studentName} (${paymentData.method}).`,
      type: 'PAYMENT_RECEIVED',
      channel: 'WHATSAPP',
      recipient: paymentData.parentName,
    });

    return newPayment;
  };

  const updateAttendance = (id: string, status: AttendanceStatus, reason?: string) => {
    setAttendances(prev => prev.map(a => a.id === id ? { ...a, status, reason: reason || a.reason } : a));
  };

  const markBatchAttendance = (records: { studentId: string; status: AttendanceStatus }[]) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendances(prev => {
      const updated = [...prev];
      records.forEach(r => {
        const existingIdx = updated.findIndex(a => a.studentId === r.studentId && a.date === today);
        const stu = students.find(s => s.id === r.studentId);
        if (existingIdx >= 0) {
          updated[existingIdx] = { ...updated[existingIdx], status: r.status };
        } else if (stu) {
          updated.push({
            id: `att-${Date.now()}-${r.studentId}`,
            studentId: stu.id,
            studentName: `${stu.firstName} ${stu.lastName}`,
            matricule: stu.matricule,
            classId: stu.classId,
            className: stu.className,
            date: today,
            status: r.status,
          });
        }
      });
      return updated;
    });
  };

  const addHomework = (hwData: Omit<HomeworkItem, 'id' | 'assignedDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newHw: HomeworkItem = {
      ...hwData,
      id: `hw-${Date.now()}`,
      assignedDate: today,
      submissionsCount: 0,
    };
    setHomeworks(prev => [newHw, ...prev]);

    addNotification({
      title: `Nouveau Devoir : ${hwData.subjectName}`,
      message: `${hwData.title} à rendre pour le ${hwData.dueDate} (${hwData.className}).`,
      type: 'ANNOUNCEMENT',
      channel: 'IN_APP',
      recipient: `Élèves de ${hwData.className}`,
    });
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: 'À l\'instant',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>): { success: boolean; error?: string } => {
    // Conflict 1: Check Teacher
    const conflictTeacher = timetables.find(
      t => t.teacherId === slotData.teacherId &&
           t.dayOfWeek === slotData.dayOfWeek &&
           t.startTime === slotData.startTime
    );

    if (conflictTeacher) {
      return {
        success: false,
        error: `Conflit Enseignant : ${slotData.teacherName} est déjà programmé(e) avec la classe de ${conflictTeacher.className} (${conflictTeacher.subjectName}) le ${slotData.dayOfWeek} à ${slotData.startTime}.`,
      };
    }

    // Conflict 2: Check Room
    const conflictRoom = timetables.find(
      t => t.room === slotData.room &&
           t.dayOfWeek === slotData.dayOfWeek &&
           t.startTime === slotData.startTime
    );

    if (conflictRoom) {
      return {
        success: false,
        error: `Conflit de Salle : La salle "${slotData.room}" est déjà réservée pour la classe ${conflictRoom.className} (${conflictRoom.subjectName}) le ${slotData.dayOfWeek} à ${slotData.startTime}.`,
      };
    }

    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`,
    };

    setTimetables(prev => [...prev, newSlot]);
    addNotification({
      title: `Cours programmé : ${slotData.className}`,
      message: `${slotData.subjectName} avec ${slotData.teacherName} le ${slotData.dayOfWeek} (${slotData.startTime}-${slotData.endTime}).`,
      type: 'ANNOUNCEMENT',
      channel: 'IN_APP',
      recipient: `Classe de ${slotData.className}`,
    });

    return { success: true };
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const updatePromotion = (id: string, data: Partial<PromotionRecord>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const publishAllPromotions = () => {
    setPromotions(prev => prev.map(p => ({ ...p, isPublishedToParents: true })));
    addNotification({
      title: 'Résultats des Délibérations de Passage Publiés',
      message: 'Les décisions du conseil des professeurs (Admis en classe supérieure / Redoublement) sont maintenant consultables par les parents.',
      type: 'ANNOUNCEMENT',
      channel: 'IN_APP',
      recipient: 'Tous les Parents d\'Élèves',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentSchool,
        updateSchool,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        parents,
        teachers,
        addTeacher,
        updateTeacher,
        classes,
        subjects,
        payments,
        addPayment,
        overdueFees,
        attendances,
        updateAttendance,
        markBatchAttendance,
        homeworks,
        addHomework,
        notifications,
        addNotification,
        markNotificationAsRead,
        currentParentChildId,
        setCurrentParentChildId,
        activeReportCard,
        timetables,
        addTimetableSlot,
        deleteTimetableSlot,
        promotions,
        updatePromotion,
        publishAllPromotions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
