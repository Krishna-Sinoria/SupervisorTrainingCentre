export interface User {
  id: string;
  email: string;
  name: string;
  role: 'director' | 'trainer';
  position?: string;
  phone?: string;
  address?: string;
  department?: string;
  joinDate?: string;
  photo?: string;
  active: boolean;
}

export interface Trainee {
  id: string;
  ticketNumber: string;
  photo?: string;
  serialNo: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  dateOfAppointment: string;
  dateOfSparing: string;
  category: string;
  bloodGroup: string;
  maritalStatus: string;
  employeeName: string;
  pfNumber: string;
  nationality: string;
  modeOfAppointment: string;
  batch: string;
  designation: string;
  moduleNumber: string;
  courseDuration: string;
  stream: string;
  unit: string;
  workingUnder: string;
  stationCode: string;
  phoneNumber: string;
  email: string;
  address: string;
  educationalQualification: string;
  trainerId: string;
  createdAt: string;
  marks?: Marks;
  grade?: string;
  totalMarks?: number;
}

export interface Marks {
  railwayOrganization: number;
  mechanicalDepartmentRole: number;
  rollingStockCarriage: number;
  rollingStockWagon: number;
  rollingStockDiesel: number;
  industrialSafety: number;
  coachProduction: number;
  rwf: number;
  demuSpart: number;
  dieselProduction: number;
  rdso: number;
}

export interface Analytics {
  totalTrainees: number;
  activeTrainers: number;
  courseDistribution: { name: string; value: number }[];
  monthlyEnrollment: { month: string; enrollments: number }[];
  moduleEnrollment: { module: string; count: number }[];
}