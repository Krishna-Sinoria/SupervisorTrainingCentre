import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
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
      const demoTrainees = [/*...*/]; // ✅ For brevity, paste your trainee objects here as-is
      setTrainees(demoTrainees);
      localStorage.setItem('stc_trainees', JSON.stringify(demoTrainees));
    }

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
      const demoTrainers = [
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

  const saveTrainees = (newTrainees) => {
    setTrainees(newTrainees);
    localStorage.setItem('stc_trainees', JSON.stringify(newTrainees));
  };

  const saveTrainers = (newTrainers) => {
    setTrainers(newTrainers);
    localStorage.setItem('stc_trainers', JSON.stringify(newTrainers));
  };

  const generateTraineeId = () => {
    const year = new Date().getFullYear();
    const count = trainees.length + 1;
    return `STC${year}-${count.toString().padStart(3, '0')}`;
  };

  const generateTicketNumber = () => {
    const year = new Date().getFullYear();
    const count = trainees.length + 1;
    return `TKT-${year}-${count.toString().padStart(3, '0')}`;
  };

  const generateTrainerId = () => {
    const count = trainers.length + 4;
    return count.toString();
  };

  const addTrainee = async (traineeData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrainee = {
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

  const updateTrainee = (id, updates) => {
    const updatedTrainees = trainees.map(trainee =>
      trainee.id === id ? { ...trainee, ...updates } : trainee
    );
    saveTrainees(updatedTrainees);
  };

  const deleteTrainee = (id) => {
    const updatedTrainees = trainees.filter(trainee => trainee.id !== id);
    saveTrainees(updatedTrainees);
  };

  const addTrainer = async (trainerData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrainer = {
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

  const updateTrainer = (id, updates) => {
    const updatedTrainers = trainers.map(trainer =>
      trainer.id === id ? { ...trainer, ...updates } : trainer
    );
    saveTrainers(updatedTrainers);
  };

  const deleteTrainer = (id) => {
    const updatedTrainees = trainees.filter(trainee => trainee.trainerId !== id);
    saveTrainees(updatedTrainees);

    const updatedTrainers = trainers.filter(trainer => trainer.id !== id);
    saveTrainers(updatedTrainers);
  };

  const getTraineesByTrainer = (trainerId) => {
    return trainees.filter(trainee => trainee.trainerId === trainerId);
  };

  const getTrainerById = (id) => {
    return trainers.find(trainer => trainer.id === id);
  };

  const getAnalytics = () => {
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

    const monthlyData = {};
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
    <DataContext.Provider
      value={{
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
      }}
    >
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
