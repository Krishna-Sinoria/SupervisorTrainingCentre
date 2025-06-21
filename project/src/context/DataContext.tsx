import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trainee, Analytics, User } from '../types';

interface DataContextType {
  trainees: Trainee[];
  trainers: User[];
  addTrainee: (trainee: Omit<Trainee, 'id' | 'ticketNumber' | 'createdAt'>) => Promise<void>;
  updateTrainee: (id: string, updates: Partial<Trainee>) => void;
  deleteTrainee: (id: string) => void;
  getTraineesByTrainer: (trainerId: string) => Trainee[];
  getAnalytics: () => Analytics;
  generateTicketNumber: () => string;
  generateTraineeId: () => string;
  addTrainer: (trainer: Omit<User, 'id'>) => Promise<void>;
  updateTrainer: (id: string, updates: Partial<User>) => void;
  deleteTrainer: (id: string) => void;
  getTrainerById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize trainees
    const savedTrainees = localStorage.getItem('stc_trainees');
    if (savedTrainees) {
      try {
        const parsedTrainees = JSON.parse(savedTrainees);
        setTrainees(Array.isArray(parsedTrainees) ? parsedTrainees : []);
      } catch (error) {
        console.error('Error parsing saved trainees:', error);
        setTrainees([]);
      }
    } else {
      // Initialize with demo data
      const demoTrainees: Trainee[] = [
        {
          id: 'STC2025-001',
          ticketNumber: 'TKT-2025-001',
          serialNo: '001',
          fullName: 'Amit Kumar Singh',
          fatherName: 'Ram Singh',
          motherName: 'Sita Singh',
          dateOfBirth: '1995-05-15',
          dateOfAppointment: '2020-01-15',
          dateOfSparing: '2024-12-01',
          category: 'General',
          bloodGroup: 'B+',
          maritalStatus: 'Married',
          employeeName: 'Amit Kumar Singh',
          pfNumber: 'PF12345678',
          nationality: 'Indian',
          modeOfAppointment: 'RRB',
          batch: '2024-25',
          designation: 'JE',
          moduleNumber: 'MJI-W',
          courseDuration: '13 weeks',
          stream: 'Workshop',
          unit: 'JAT',
          workingUnder: 'Senior Section Engineer',
          stationCode: 'JAT',
          phoneNumber: '+91-9876543210',
          email: 'amit.singh@railway.gov.in',
          address: '123 Railway Colony, Jalandhar, Punjab',
          educationalQualification: 'B.Tech Mechanical Engineering',
          trainerId: '2',
          createdAt: '2024-12-01T10:00:00Z',
          marks: {
            railwayOrganization: 85,
            mechanicalDepartmentRole: 88,
            rollingStockCarriage: 82,
            rollingStockWagon: 90,
            rollingStockDiesel: 87,
            industrialSafety: 92,
            coachProduction: 89,
            rwf: 86,
            demuSpart: 84,
            dieselProduction: 88,
            rdso: 90
          },
          totalMarks: 961,
          grade: 'A'
        },
        {
          id: 'STC2025-002',
          ticketNumber: 'TKT-2025-002',
          serialNo: '002',
          fullName: 'Priya Sharma',
          fatherName: 'Rajesh Sharma',
          motherName: 'Sunita Sharma',
          dateOfBirth: '1993-08-22',
          dateOfAppointment: '2019-03-10',
          dateOfSparing: '2024-11-15',
          category: 'OBC',
          bloodGroup: 'A+',
          maritalStatus: 'Single',
          employeeName: 'Priya Sharma',
          pfNumber: 'PF87654321',
          nationality: 'Indian',
          modeOfAppointment: 'LDCE',
          batch: '2024-25',
          designation: 'SSE',
          moduleNumber: 'MSE-C',
          courseDuration: '52 weeks',
          stream: 'CNW',
          unit: 'DLI',
          workingUnder: 'Divisional Railway Manager',
          stationCode: 'DLI',
          phoneNumber: '+91-9876543211',
          email: 'priya.sharma@railway.gov.in',
          address: '456 Railway Quarters, Delhi',
          educationalQualification: 'M.Tech Electrical Engineering',
          trainerId: '3',
          createdAt: '2024-11-15T14:30:00Z'
        },
        {
          id: 'STC2025-003',
          ticketNumber: 'TKT-2025-003',
          serialNo: '003',
          fullName: 'Rajesh Kumar Patel',
          fatherName: 'Mohan Patel',
          motherName: 'Kamala Patel',
          dateOfBirth: '1990-12-05',
          dateOfAppointment: '2018-07-20',
          dateOfSparing: '2024-10-01',
          category: 'General',
          bloodGroup: 'O+',
          maritalStatus: 'Married',
          employeeName: 'Rajesh Kumar Patel',
          pfNumber: 'PF11223344',
          nationality: 'Indian',
          modeOfAppointment: 'RRB',
          batch: '2024-25',
          designation: 'JE',
          moduleNumber: 'MJI-D',
          courseDuration: '13 weeks',
          stream: 'Diesel',
          unit: 'FZR',
          workingUnder: 'Assistant Divisional Engineer',
          stationCode: 'FZR',
          phoneNumber: '+91-9876543212',
          email: 'rajesh.patel@railway.gov.in',
          address: '789 Staff Colony, Firozpur, Punjab',
          educationalQualification: 'Diploma in Mechanical Engineering',
          trainerId: '2',
          createdAt: '2024-10-01T09:15:00Z',
          marks: {
            railwayOrganization: 78,
            mechanicalDepartmentRole: 82,
            rollingStockCarriage: 75,
            rollingStockWagon: 88,
            rollingStockDiesel: 92,
            industrialSafety: 85,
            coachProduction: 80,
            rwf: 83,
            demuSpart: 87,
            dieselProduction: 91,
            rdso: 86
          },
          totalMarks: 927,
          grade: 'A'
        }
      ];
      setTrainees(demoTrainees);
      localStorage.setItem('stc_trainees', JSON.stringify(demoTrainees));
    }

    // Initialize trainers
    const savedTrainers = localStorage.getItem('stc_trainers');
    if (savedTrainers) {
      try {
        const parsedTrainers = JSON.parse(savedTrainers);
        setTrainers(Array.isArray(parsedTrainers) ? parsedTrainers : []);
      } catch (error) {
        console.error('Error parsing saved trainers:', error);
        setTrainers([]);
      }
    } else {
      const demoTrainers: User[] = [
        {
          id: '2',
          email: 'trainer1@stc.railway.gov.in',
          name: 'Rajesh Kumar',
          role: 'trainer',
          position: 'Senior Trainer',
          phone: '+91-9876543201',
          address: 'Staff Quarters Block A, STC Campus',
          department: 'Mechanical',
          joinDate: '2020-03-15',
          active: true
        },
        {
          id: '3',
          email: 'trainer2@stc.railway.gov.in',
          name: 'Priya Sharma',
          role: 'trainer',
          position: 'Trainer',
          phone: '+91-9876543202',
          address: 'Staff Quarters Block B, STC Campus',
          department: 'Electrical',
          joinDate: '2021-07-20',
          active: true
        }
      ];
      setTrainers(demoTrainers);
      localStorage.setItem('stc_trainers', JSON.stringify(demoTrainers));
    }
  }, []);

  const saveTrainees = (newTrainees: Trainee[]) => {
    setTrainees(newTrainees);
    localStorage.setItem('stc_trainees', JSON.stringify(newTrainees));
  };

  const saveTrainers = (newTrainers: User[]) => {
    setTrainers(newTrainers);
    localStorage.setItem('stc_trainers', JSON.stringify(newTrainers));
  };

  const generateTraineeId = (): string => {
    const year = new Date().getFullYear();
    const count = trainees.length + 1;
    return `STC${year}-${count.toString().padStart(3, '0')}`;
  };

  const generateTicketNumber = (): string => {
    const year = new Date().getFullYear();
    const count = trainees.length + 1;
    return `TKT-${year}-${count.toString().padStart(3, '0')}`;
  };

  const generateTrainerId = (): string => {
    const count = trainers.length + 4; // Start from 4 since we have director (1) and 2 existing trainers
    return count.toString();
  };

  const addTrainee = async (traineeData: Omit<Trainee, 'id' | 'ticketNumber' | 'createdAt'>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrainee: Trainee = {
          ...traineeData,
          id: generateTraineeId(),
          ticketNumber: generateTicketNumber(),
          createdAt: new Date().toISOString()
        };
        
        const updatedTrainees = [...trainees, newTrainee];
        saveTrainees(updatedTrainees);
        resolve();
      }, 500);
    });
  };

  const updateTrainee = (id: string, updates: Partial<Trainee>) => {
    const updatedTrainees = trainees.map(trainee =>
      trainee.id === id ? { ...trainee, ...updates } : trainee
    );
    saveTrainees(updatedTrainees);
  };

  const deleteTrainee = (id: string) => {
    const updatedTrainees = trainees.filter(trainee => trainee.id !== id);
    saveTrainees(updatedTrainees);
  };

  const addTrainer = async (trainerData: Omit<User, 'id'>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrainer: User = {
          ...trainerData,
          id: generateTrainerId(),
          role: 'trainer'
        };
        
        const updatedTrainers = [...trainers, newTrainer];
        saveTrainers(updatedTrainers);
        resolve();
      }, 500);
    });
  };

  const updateTrainer = (id: string, updates: Partial<User>) => {
    const updatedTrainers = trainers.map(trainer =>
      trainer.id === id ? { ...trainer, ...updates } : trainer
    );
    saveTrainers(updatedTrainers);
  };

  const deleteTrainer = (id: string) => {
    // Also delete all trainees associated with this trainer
    const updatedTrainees = trainees.filter(trainee => trainee.trainerId !== id);
    saveTrainees(updatedTrainees);
    
    const updatedTrainers = trainers.filter(trainer => trainer.id !== id);
    saveTrainers(updatedTrainers);
  };

  const getTraineesByTrainer = (trainerId: string) => {
    return trainees.filter(trainee => trainee.trainerId === trainerId);
  };

  const getTrainerById = (id: string) => {
    return trainers.find(trainer => trainer.id === id);
  };

  const getAnalytics = (): Analytics => {
    const totalTrainees = trainees.length;
    const activeTrainers = trainers.filter(t => t.active).length;

    const courseDistribution = [
      { name: '13 weeks', value: trainees.filter(t => t.courseDuration === '13 weeks').length },
      { name: '52 weeks', value: trainees.filter(t => t.courseDuration === '52 weeks').length },
      { name: 'Others', value: trainees.filter(t => !['13 weeks', '52 weeks'].includes(t.courseDuration)).length }
    ].filter(item => item.value > 0);

    const moduleEnrollment = [
      { module: 'MSE-C', count: trainees.filter(t => t.moduleNumber === 'MSE-C').length },
      { module: 'MJI-W', count: trainees.filter(t => t.moduleNumber === 'MJI-W').length },
      { module: 'MJI-D', count: trainees.filter(t => t.moduleNumber === 'MJI-D').length }
    ].filter(item => item.count > 0);

    const monthlyData: { [key: string]: number } = {};
    trainees.forEach(trainee => {
      const date = new Date(trainee.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const monthlyEnrollment = Object.entries(monthlyData).map(([month, enrollments]) => ({
      month,
      enrollments
    }));

    return {
      totalTrainees,
      activeTrainers,
      courseDistribution,
      monthlyEnrollment,
      moduleEnrollment
    };
  };

  return (
    <DataContext.Provider value={{
      trainees,
      trainers,
      addTrainee,
      updateTrainee,
      deleteTrainee,
      getTraineesByTrainer,
      getAnalytics,
      generateTicketNumber,
      generateTraineeId,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      getTrainerById
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};