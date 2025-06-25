import React, { useState } from 'react';
import { Download, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import TraineeModal from '../Common/TraineeModal';

const TraineeTooltip = ({ trainee, position }) => (
  <div
    className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
    style={{ 
      left: position.x + 10, 
      top: position.y - 10,
      transform: 'translateY(-100%)'
    }}
  >
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{trainee.fullName}</p>
          <p className="text-xs text-gray-600">{trainee.id}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Module</p>
          <p className="font-medium">{trainee.moduleNumber}</p>
        </div>
        <div>
          <p className="text-gray-500">Designation</p>
          <p className="font-medium">{trainee.designation}</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium text-xs">{trainee.email}</p>
        </div>
        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{trainee.phoneNumber}</p>
        </div>
      </div>
      {trainee.grade && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Grade:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              trainee.grade === 'A+' ? 'bg-green-100 text-green-800' :
              trainee.grade === 'A' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {trainee.grade}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function ViewTrainees({ loggedInTrainerId }) {
  const { trainees, trainers, getTraineesByTrainer } = useData();
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [hoveredTrainee, setHoveredTrainee] = useState(null);

  const trainer = trainers.find(t => t.id === loggedInTrainerId);
  const trainerTrainees = getTraineesByTrainer(loggedInTrainerId);
  const selectedTraineeData = selectedTrainee ? trainees.find(t => t.id === selectedTrainee) : null;

  const handleTraineeHover = (trainee, event) => {
    setHoveredTrainee({
      trainee,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const handleTraineeLeave = () => {
    setHoveredTrainee(null);
  };

  const exportTraineeProfile = (trainee) => {
    const profileContent = `...`; // Keep your existing export logic here
    const blob = new Blob([profileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainee_profile_${trainee.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!trainer) return <div>Loading your profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{trainer.name}'s Trainees</h2>
          <p className="text-sm text-gray-600">
            {trainer.position} - {trainer.department}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Total Trainees: <span className="font-medium">{trainerTrainees.length}</span>
            {trainerTrainees.filter(t => t.grade).length > 0 && (
              <span className="ml-4">
                Completed: <span className="font-medium">{trainerTrainees.filter(t => t.grade).length}</span>
              </span>
            )}
          </p>
        </div>

        {trainerTrainees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Start Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainerTrainees.map((trainee) => (
                  <tr key={trainee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedTrainee(trainee.id)}
                        onMouseEnter={(e) => handleTraineeHover(trainee, e)}
                        onMouseLeave={handleTraineeLeave}
                        className="font-medium text-blue-600 hover:text-blue-800 text-left"
                      >
                        {trainee.fullName}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{trainee.id}</td>
                    <td className="py-3 px-4 text-gray-600">{trainee.email}</td>
                    <td className="py-3 px-4 text-gray-600">{trainee.moduleNumber}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(trainee.dateOfSparing).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {trainee.grade ? (
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          trainee.grade === 'A+' ? 'bg-green-100 text-green-800' :
                          trainee.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                          trainee.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                          trainee.grade === 'B' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trainee.grade}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => exportTraineeProfile(trainee)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Export PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainees assigned</h3>
            <p className="text-gray-600">
              You don't have any trainees assigned yet.
            </p>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
      {hoveredTrainee && (
        <TraineeTooltip 
          trainee={hoveredTrainee.trainee} 
          position={hoveredTrainee.position} 
        />
      )}

      {/* Trainee Modal */}
      {selectedTraineeData && (
        <TraineeModal
          trainee={selectedTraineeData}
          onClose={() => setSelectedTrainee(null)}
        />
      )}
    </div>
  );
}