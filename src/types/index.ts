// Types globaux pour EduGestion Africa

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN' // Directeur / Principal
  | 'SECRETARY'    // Secrétaire
  | 'ACCOUNTANT'   // Comptable
  | 'TEACHER'      // Enseignant
  | 'PARENT'       // Parent / Tuteur
  | 'STUDENT';     // Élève

export type PlanType = 'STARTER' | 'BUSINESS' | 'PRO' | 'ENTERPRISE';

export type PaymentMethod = 'CASH' | 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'BANK_TRANSFER' | 'CHECK';

export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';

export type EvaluationType = 'DEVOIR' | 'INTERROGATION' | 'COMPOSITION' | 'EXAMEN';

export type TermPeriod = 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3' | 'SEMESTRE_1' | 'SEMESTRE_2';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  schoolName?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  slug: string;
  logo?: string;
  slogan?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  academicLevels: string[];
  currency: string;
  timezone: string;
  createdAt: string;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
}

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  birthPlace: string;
  nationality: string;
  photo?: string;
  address?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  classId: string;
  className: string;
  level: string;
  academicYear: string;
  status: 'INSCRIT' | 'EN_ATTENTE' | 'DEMANDE' | 'TRANSFERE' | 'ABANDON';
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentWhatsapp?: string;
  relationship: string;
  feeBalance: number; // Montant restant à payer
  totalFees: number;
  paidFees: number;
  averageGrade?: number;
  unjustifiedAbsences?: number;
  promotionStatus?: PromotionStatus;
  nextClassName?: string;
  councilObservation?: string;
}

export type PromotionStatus = 'ADMIS' | 'REDOUBLE' | 'REORIENTE' | 'EXCLU' | 'EN_DELIBERATION';

export interface PromotionRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  photo?: string;
  currentClassId: string;
  currentClassName: string;
  annualAverage: number;
  status: PromotionStatus;
  nextClassName?: string;
  mention?: 'FELICITATIONS' | 'TABLEAU_HONNEUR' | 'ENCOURAGEMENTS' | 'AVERTISSEMENT' | 'AUCUNE';
  councilObservation?: string;
  deliberationDate: string;
  isPublishedToParents: boolean;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  profession?: string;
  address?: string;
  children: {
    id: string;
    matricule: string;
    name: string;
    className: string;
    photo?: string;
    feeBalance: number;
    averageGrade?: number;
    promotionStatus?: PromotionStatus;
    nextClassName?: string;
  }[];
}

export interface Teacher {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  photo?: string;
  phone: string;
  email?: string;
  birthDate?: string;
  birthPlace?: string;
  idCardNumber?: string;
  quartier?: string;
  specialty: string;
  contractType: string;
  hireDate: string;
  assignedClasses: {
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
  }[];
  isMainTeacherOf?: string; // ClassName
}

export interface Classroom {
  id: string;
  name: string;
  level: string;
  cycle: 'PRIMAIRE' | 'COLLEGE' | 'LYCEE';
  capacity: number;
  studentCount: number;
  roomNumber?: string;
  mainTeacherId?: string;
  mainTeacherName?: string;
  academicYear: string;
  averageGrade?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  defaultCoeff: number;
  colorCode: string;
}

export interface StudentFee {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  parentName: string;
  parentPhone: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  isOverdue: boolean;
  daysOverdue: number;
  lastPaymentDate?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  transactionRef?: string;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  parentName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  feeType: string;
  paidAt: string;
  recordedBy: string;
  note?: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  subjectId: string;
  subjectName: string;
  coeff: number;
  type: EvaluationType;
  title: string;
  score: number; // /20
  maxScore: number;
  term: TermPeriod;
  date: string;
  comment?: string;
}

export interface SubjectReport {
  subjectId: string;
  subjectName: string;
  coeff: number;
  teacherName: string;
  grades: number[];
  average: number;
  classAverage: number;
  minGrade: number;
  maxGrade: number;
  rank: number;
  appreciation: string;
}

export interface ReportCard {
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  academicYear: string;
  term: TermPeriod;
  studentPhoto?: string;
  subjects: SubjectReport[];
  totalCoeff: number;
  totalPoints: number;
  generalAverage: number;
  classAverage: number;
  rank: number;
  totalStudents: number;
  absencesCount: number;
  unjustifiedAbsencesCount: number;
  appreciation: string;
  mention: string;
  directorSignatureUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  classId: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  reason?: string;
  lateMinutes?: number;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
  startTime: string;
  endTime: string;
  room: string;
  color: string;
}

export interface HomeworkItem {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  submissionsCount?: number;
  totalStudents?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'PAYMENT_RECEIVED' | 'PAYMENT_DUE' | 'PAYMENT_OVERDUE' | 'STUDENT_ABSENT' | 'GRADE_PUBLISHED' | 'REPORT_AVAILABLE' | 'ANNOUNCEMENT' | 'SYSTEM_ALERT';
  channel: 'IN_APP' | 'SMS' | 'WHATSAPP' | 'EMAIL';
  createdAt: string;
  isRead: boolean;
  recipient?: string;
}

export interface SuperAdminStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiredSubscriptions: number;
  mrrFCFA: number;
  arrFCFA: number;
  monthlyGrowthPercent: number;
  totalPaymentsVolumeFCFA: number;
}
