
import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Eye, CheckCircle, X, User, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function RoleManager() {
  const { trainers, addTrainer, updateTrainer, deleteTrainer, getTraineesByTrainer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [newTrainerData, setNewTrainerData] = useState({
    name: '', email: '', position: '', department: '', phone: '', address: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const allUsers = [
    {
      id: '1', name: 'Director STC', email: 'director@stc.railway.gov.in',
      role: 'director', position: 'Director', department: 'Administration',
      phone: '+91-9876543200', address: 'Director Quarters, STC Campus',
      joinDate: '2015-01-15', active: true
    },
    ...trainers
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTrainerData = trainers.find(t => t.id === selectedTrainer);
  const trainerTrainees = selectedTrainer ? getTraineesByTrainer(selectedTrainer) : [];

  const handleEditTrainer = (trainer) => {
    setEditingTrainer(trainer.id);
    setEditFormData(trainer);
  };

  const handleSaveEdit = () => {
    if (editingTrainer && editFormData) {
      updateTrainer(editingTrainer, editFormData);
      setEditingTrainer(null);
      setEditFormData({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingTrainer(null);
    setEditFormData({});
  };

  const handleDeleteTrainer = (trainerId) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      deleteTrainer(trainerId);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleAddTrainer = async () => {
    try {
      await addTrainer({ ...newTrainerData, role: 'trainer', active: true });
      setNewTrainerData({
        name: '', email: '', position: '', department: '', phone: '', address: '',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      alert('Error adding trainer.');
    }
  };

  // const getBadge = (val, type) => {
  //   const base = 'px-2 py-1 rounded-full text-sm font-medium';
  //   if (type === 'role') return val === 'director' ? ${base} bg-purple-100 text-purple-800 : ${base} bg-blue-100 text-blue-800;
  //   return val ? ${base} bg-green-100 text-green-800 : ${base} bg-red-100 text-red-800;
  // };

    const getBadge = (val, type) => {
  const base = 'px-2 py-1 rounded-full text-sm font-medium';
  if (type === 'role') {
    return val === 'director'
      ? `${base} bg-purple-100 text-purple-800`
      : `${base} bg-blue-100 text-blue-800;`
  }
  return val
    ? `${base} bg-green-100 text-green-800`
    : `${base} bg-red-100 text-red-800;`
};


  const RoleIcon = role => role === 'director' ? Shield : User;


  return (
    <div className="space-y-6">
      {showSuccess && <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-2 items-center">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <p className="text-green-800 font-medium">Success!</p>
      </div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Role Manager</h2>
          <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Trainer
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["User", "Role", "Department", "Status", "Trainees", "Actions"].map((th, i) => (
                  <th key={i} className="text-left py-3 px-4 font-semibold text-gray-900">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const Icon = RoleIcon(user.role);
                const traineeCount = user.role === 'trainer' ? getTraineesByTrainer(user.id).length : 0;
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full"><Icon className="h-4 w-4 text-gray-600" /></div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={getBadge(user.role, 'role')}>{user.role}</span>
                      <p className="text-sm text-gray-600 mt-1">{user.position}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.department}</td>
                    <td className="py-3 px-4">
                      <span className={getBadge(user.active, 'status')}>{user.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.role === 'trainer' ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{traineeCount} trainees</span>
                      ) : (<span className="text-gray-500">-</span>)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'trainer' ? (
                          <>
                            <button onClick={() => setSelectedTrainer(user.id)} className="text-blue-600 hover:text-blue-800" title="View Trainees"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleEditTrainer(user)} className="text-green-600 hover:text-green-800" title="Edit"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteTrainer(user.id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </>
                        ) : <span className="text-gray-400 text-sm">Protected</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <ModalForm title="Add Trainer" onClose={() => setShowAddForm(false)} onSubmit={handleAddTrainer} formData={newTrainerData} setFormData={setNewTrainerData} />
      )}
      {editingTrainer && (
        <ModalForm title="Edit Trainer" onClose={handleCancelEdit} onSubmit={handleSaveEdit} formData={editFormData} setFormData={setEditFormData} isEdit />
      )}
      {selectedTrainer && selectedTrainerData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTrainerData.name}'s Trainees</h3>
                <p className="text-sm text-gray-600">{selectedTrainerData.position} - {selectedTrainerData.department}</p>
              </div>
              <button onClick={() => setSelectedTrainer(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-2">Total: {trainerTrainees.length}</p>
              {trainerTrainees.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {['Name', 'ID', 'Module', 'Grade', 'Status'].map((h, i) => (
                        <th key={i} className="text-left py-3 px-4 font-semibold text-gray-900">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trainerTrainees.map(t => (
                      <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{t.fullName}</td>
                        <td className="py-3 px-4 text-gray-600">{t.id}</td>
                        <td className="py-3 px-4 text-gray-600">{t.moduleNumber}</td>
                        <td className="py-3 px-4 text-sm">
                          {t.grade ? <span className={`px-2 py-1 rounded-full font-medium ${
                            t.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            t.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                            t.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                            t.grade === 'B' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>{t.grade}</span> : <span className="text-gray-500">Pending</span>}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {t.marks ? <span className="text-green-600">Completed</span> : <span className="text-orange-600">In Progress</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No trainees assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalForm({ title, onClose, onSubmit, formData, setFormData, isEdit = false }) {
  const fields = ['name', 'email', 'position', 'department', 'phone', 'joinDate'];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'joinDate' ? 'date' : 'text'}
                  value={formData[field] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.active ? 'active' : 'inactive'}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'active' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{isEdit ? 'Save Changes' : 'Add Trainer'}</button>
        </div>
      </div>
    </div>
  );
}