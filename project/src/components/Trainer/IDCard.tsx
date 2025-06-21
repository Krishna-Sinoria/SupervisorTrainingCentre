import React, { useState } from 'react';
import { Download, CreditCard, User, Train, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function IDCard() {
  const { user } = useAuth();
  const { getTraineesByTrainer } = useData();
  const [selectedTrainee, setSelectedTrainee] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const myTrainees = getTraineesByTrainer(user?.id || '');
  const selectedTraineeData = myTrainees.find(t => t.id === selectedTrainee);

  const generateIDCard = () => {
    if (!selectedTraineeData) return;

    // Create HTML content for the ID card
    const idCardContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>STC ID Card - ${selectedTraineeData.fullName}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
          }
          .id-card {
            width: 300px;
            height: 450px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            color: white;
            position: relative;
            overflow: hidden;
          }
          .id-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
          }
          .logo {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1e40af;
            font-weight: bold;
            font-size: 18px;
          }
          .org-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .sub-title {
            font-size: 12px;
            opacity: 0.9;
          }
          .photo-section {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
          }
          .photo {
            width: 100px;
            height: 120px;
            background: white;
            border-radius: 8px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1e40af;
            font-size: 40px;
            overflow: hidden;
          }
          .photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          .details {
            position: relative;
            z-index: 2;
          }
          .detail-row {
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding-bottom: 8px;
          }
          .detail-label {
            font-size: 10px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .detail-value {
            font-size: 14px;
            font-weight: 600;
            margin-top: 2px;
          }
          .id-number {
            background: rgba(255,255,255,0.2);
            padding: 8px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            letter-spacing: 1px;
          }
          .footer {
            position: absolute;
            bottom: 15px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 8px;
            opacity: 0.7;
          }
          .print-button {
            margin: 20px auto;
            display: block;
            padding: 10px 20px;
            background: #1e40af;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div>
          <button class="print-button no-print" onclick="window.print()">Print ID Card</button>
          <div class="id-card">
            <div class="header">
              <div class="logo">🚂</div>
              <div class="org-name">STC</div>
              <div class="sub-title">Supervisors Training Centre<br/>Northern Railway</div>
            </div>
            
            <div class="photo-section">
              <div class="photo">
                ${selectedTraineeData.photo ? `<img src="${selectedTraineeData.photo}" alt="Trainee Photo" />` : '👤'}
              </div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <div class="detail-label">Name</div>
                <div class="detail-value">${selectedTraineeData.fullName}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Course</div>
                <div class="detail-value">${selectedTraineeData.moduleNumber}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Designation</div>
                <div class="detail-value">${selectedTraineeData.designation}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${selectedTraineeData.courseDuration}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Email</div>
                <div class="detail-value" style="font-size: 10px;">${selectedTraineeData.email}</div>
              </div>
              
              <div class="id-number">
                ${selectedTraineeData.id}
              </div>
            </div>
            
            <div class="footer">
              Valid for training period only<br/>
              Government of India
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the HTML file
    const blob = new Blob([idCardContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `id_card_${selectedTraineeData.id}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">ID Card generated and downloaded successfully!</p>
          </div>
        </div>
      )}

      {/* Trainee Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate ID Card</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <select
              value={selectedTrainee}
              onChange={(e) => setSelectedTrainee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a trainee...</option>
              {myTrainees.map((trainee) => (
                <option key={trainee.id} value={trainee.id}>
                  {trainee.fullName} - {trainee.id} ({trainee.moduleNumber})
                </option>
              ))}
            </select>
          </div>
          {selectedTraineeData && (
            <button
              onClick={generateIDCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Generate ID Card
            </button>
          )}
        </div>
      </div>

      {selectedTraineeData && (
        <>
          {/* ID Card Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Card Preview</h3>
            
            <div className="flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                
                {/* Header */}
                <div className="text-center mb-6 relative z-10">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <Train className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">STC</h3>
                  <p className="text-blue-100 text-sm">Supervisors Training Centre</p>
                  <p className="text-blue-100 text-xs">Northern Railway</p>
                </div>

                {/* Photo */}
                <div className="text-center mb-6 relative z-10">
                  <div className="w-24 h-28 bg-white rounded-lg flex items-center justify-center mx-auto overflow-hidden">
                    {selectedTraineeData.photo ? (
                      <img 
                        src={selectedTraineeData.photo} 
                        alt="Trainee" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    ) : (
                      <User className="h-12 w-12 text-blue-600" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 relative z-10">
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-sm">{selectedTraineeData.fullName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-200 text-xs uppercase tracking-wide">Course</p>
                      <p className="font-semibold text-sm">{selectedTraineeData.moduleNumber}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs uppercase tracking-wide">Designation</p>
                      <p className="font-semibold text-sm">{selectedTraineeData.designation}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wide">Duration</p>
                    <p className="font-semibold text-sm">{selectedTraineeData.courseDuration}</p>
                  </div>
                  
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-xs">{selectedTraineeData.email}</p>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 p-2 rounded text-center">
                    <p className="font-bold text-lg tracking-wider">{selectedTraineeData.id}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-3 left-6 right-6 text-center">
                  <p className="text-blue-200 text-xs">Valid for training period only</p>
                  <p className="text-blue-200 text-xs">Government of India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trainee Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainee Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-gray-900">{selectedTraineeData.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Trainee ID</p>
                <p className="text-gray-900">{selectedTraineeData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Module</p>
                <p className="text-gray-900">{selectedTraineeData.moduleNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Designation</p>
                <p className="text-gray-900">{selectedTraineeData.designation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Course Duration</p>
                <p className="text-gray-900">{selectedTraineeData.courseDuration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{selectedTraineeData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-900">{selectedTraineeData.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Unit</p>
                <p className="text-gray-900">{selectedTraineeData.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Batch</p>
                <p className="text-gray-900">{selectedTraineeData.batch}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* All ID Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Trainee ID Cards</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Module</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Designation</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTrainees.map((trainee) => (
                <tr key={trainee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{trainee.fullName}</td>
                  <td className="py-3 px-4 text-gray-600">{trainee.id}</td>
                  <td className="py-3 px-4 text-gray-600">{trainee.moduleNumber}</td>
                  <td className="py-3 px-4 text-gray-600">{trainee.designation}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedTrainee(trainee.id);
                        setTimeout(generateIDCard, 100);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Generate ID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}