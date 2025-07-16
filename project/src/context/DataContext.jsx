import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export function DataProvider({ children }) {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  

  useEffect(() => {
  const loadData = async () => {

   await fetchTrainees();
   await  fetchAllAttendance();
   await  fetchTrainers();
  }
   loadData();
    // const savedTrainers = localStorage.getItem('stc_trainers');
    // if (savedTrainers) {
    //   try {
    //     const parsed = JSON.parse(savedTrainers);
    //     setTrainers(Array.isArray(parsed) ? parsed : []);
    //   } catch (err) {
    //     console.error('Trainer data parsing error:', err);
    //     setTrainers([]);
    //   }
    // } else {
    //   const demo = [
    //     {
    //       id: '2',
    //       email: 'trainer1@stc.railway.gov.in',
    //       name: 'Rajesh Kumar',
    //       role: 'trainer',
    //       position: 'Senior Trainer',
    //       phone: '+91-9876543201',
    //       address: 'Staff Quarters Block A, STC Campus',
    //       department: 'Mechanical',
    //       joinDate: '2020-03-15',
    //       active: true
    //     },
    //     {
    //       id: '3',
    //       email: 'trainer2@stc.railway.gov.in',
    //       name: 'Priya Sharma',
    //       role: 'trainer',
    //       position: 'Trainer',
    //       phone: '+91-9876543202',
    //       address: 'Staff Quarters Block B, STC Campus',
    //       department: 'Electrical',
    //       joinDate: '2021-07-20',
    //       active: true
    //     }
    //   ];
    //   setTrainers(demo);
    //   localStorage.setItem('stc_trainers', JSON.stringify(demo));
    // }
  }, []);

  const fetchTrainees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trainees');
      setTrainees(res.data||[]);
      //setTrainees(res.data||[]);
    } catch (err) {
      console.error('Error fetching trainees:', err?.response?.data || err.message);
    }
  };

  
  //   const fetchTrainers = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/trainers');
  //     setTrainers(res.data || []);
  //   } catch (err) {
  //     console.error('Error fetching trainers:', err?.response?.data || err.message);
  //   }
  // };

  const fetchTrainers = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/trainers');
    const mapped = (res.data||[]).map(t => ({
      ...t,
      name: t.fullName || t.name || t.email,
      position: t.designation || t.position,
    }));
    setTrainers(mapped);
  } catch (err) {
    console.error('Error fetching trainers:', err?.response?.data || err.message);
  }
};

  const addTrainee = async (traineeData) => {
    try {
      console.log('📤 Sending trainee to backend:', traineeData);
      const res = await axios.post('http://localhost:5000/api/trainees', traineeData);
      const newTrainee = {
        ...traineeData,
        id: res.data.id,
        createdAt: new Date().toISOString()
      };
      await fetchTrainees();  // ✅ ensures state is updated from backend
    } catch (err) {
      console.error('Error adding trainee:', err?.response?.data || err.message);
      throw err;
    }
  };

  const updateTrainee = async (id, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/trainees/${id}`, updates);
      setTrainees(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      );
    } catch (err) {
      console.error('Error updating trainee:', err?.response?.data || err.message);
    }
  };

  const deleteTrainee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trainees/${id}`);
      setTrainees(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting trainee:', err?.response?.data || err.message);
    }
  };

  const addTrainer = async (trainerData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/trainers', trainerData);
      const newTrainer = { ...trainerData, id: res.data.id };
      setTrainers(prev => [...prev, newTrainer]);
    } catch (err) {
      console.error('Error adding trainer:', err?.response?.data || err.message);
      throw err;
    }
  };

  const updateTrainer = async (id, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/trainers/${id}`, updates);
      setTrainers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    } catch (err) {
      console.error('Error updating trainer:', err?.response?.data || err.message);
    }
  };

  const deleteTrainer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trainers/${id}`);
      setTrainers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting trainer:', err?.response?.data || err.message);
    }
  };


  /*attendance*/
   const fetchAllAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance');
      const map = {};
      res.data.forEach(record => {
        if (!map[record.trainee_id]) map[record.trainee_id] = [];
        map[record.trainee_id].push({ date: record.date, status: record.status });
      });
      setAttendanceMap(map);
    } catch (err) {
      console.error('Error fetching attendance records:', err?.response?.data || err.message);
    }
  };

  const markAttendance = async (trainee_id, date, status) => {
    try {
      await axios.post('http://localhost:5000/api/attendance', { trainee_id, date, status });
      setAttendanceMap(prev => {
        const updated = { ...prev };
        if (!updated[trainee_id]) updated[trainee_id] = [];
        const existingIndex = updated[trainee_id].findIndex(r => r.date === date);

        if (existingIndex >= 0) {
          updated[trainee_id][existingIndex].status = status;
        } else {
          updated[trainee_id].push({ date, status });
        }
        return updated;
      });
    } catch (err) {
      console.error('Error marking attendance:', err?.response?.data || err.message);
    }
  };

  const getAttendanceStatus = (trainee_id, date) => {
    const records = attendanceMap[trainee_id] || [];
    const record = records.find(r => r.date === date);
    return record ? record.status : 'Not Marked';
  };

  const getAttendanceRecords = (trainee_id) => {
    return attendanceMap[trainee_id] || [];
  };

  
  /*backend*/
 const getTraineesByTrainer = (trainerId) => {
   return trainees.filter(t => 
  t?.trainerId?.toString?.() === trainerId?.toString?.()
)
};


  const getTrainerById = (id) => {
    return trainers.find(trainer => trainer.id.toString() === id.toString());
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
    trainees.forEach(t => {
      const date = new Date(t.createdAt);
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
        addTrainer,
      updateTrainer,
      deleteTrainer,
        getTraineesByTrainer,
        getAnalytics,
        generateTicketNumber,
        generateTraineeId,
        getTrainerById,
          markAttendance,
        getAttendanceStatus,
        getAttendanceRecords,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };