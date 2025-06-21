import React, { useState } from 'react';
import { Search, Download, FileText, Calculator, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Trainee, Marks } from '../../types';

export default function Marksheet() {
  const { user } = useAuth();
  const { getTraineesByTrainer, updateTrainee } = useData();
  const [selectedTrainee, setSelectedTrainee] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [marks, setMarks] = useState<Marks>({
    railwayOrganization: 0,
    mechanicalDepartmentRole: 0,
    rollingStockCarriage: 0,
    rollingStockWagon: 0,
    rollingStockDiesel: 0,
    industrialSafety: 0,
    coachProduction: 0,
    rwf: 0,
    demuSpart: 0,
    dieselProduction: 0,
    rdso: 0
  });

  const myTrainees = getTraineesByTrainer(user?.id || '');
  const selectedTraineeData = myTrainees.find(t => t.id === selectedTrainee);

  const subjects = [
    { key: 'railwayOrganization', label: 'Railway Organization & Management', maxMarks: 100 },
    { key: 'mechanicalDepartmentRole', label: 'Role of Mechanical Department', maxMarks: 100 },
    { key: 'rollingStockCarriage', label: 'Rolling Stock Theory – Carriage', maxMarks: 100 },
    { key: 'rollingStockWagon', label: 'Rolling Stock Theory – Wagon', maxMarks: 100 },
    { key: 'rollingStockDiesel', label: 'Rolling Stock Theory – Diesel Loco, DEMU, SPART, Train Sets (MEMU/EMU)', maxMarks: 100 },
    { key: 'industrialSafety', label: 'Industrial Safety, First Aid & Firefighting', maxMarks: 100 },
    { key: 'coachProduction', label: 'Coach Production Unit', maxMarks: 100 },
    { key: 'rwf', label: 'RWF', maxMarks: 100 },
    { key: 'demuSpart', label: 'DEMU/SPART Manufacturing Unit', maxMarks: 100 },
    { key: 'dieselProduction', label: 'Diesel Production Units', maxMarks: 100 },
    { key: 'rdso', label: 'RDSO', maxMarks: 100 }
  ];

  React.useEffect(() => {
    if (selectedTraineeData?.marks) {
      setMarks(selectedTraineeData.marks);
    } else {
      setMarks({
        railwayOrganization: 0,
        mechanicalDepartmentRole: 0,
        rollingStockCarriage: 0,
        rollingStockWagon: 0,
        rollingStockDiesel: 0,
        industrialSafety: 0,
        coachProduction: 0,
        rwf: 0,
        demuSpart: 0,
        dieselProduction: 0,
        rdso: 0
      });
    }
  }, [selectedTraineeData]);

  const calculateTotal = () => {
    return Object.values(marks).reduce((sum, mark) => sum + mark, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotal();
    const maxTotal = subjects.length * 100;
    return ((total / maxTotal) * 100).toFixed(2);
  };

  const calculateGrade = () => {
    const percentage = parseFloat(calculatePercentage());
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleMarkChange = (subject: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    setMarks(prev => ({
      ...prev,
      [subject]: clampedValue
    }));
  };

  const handleSaveMarks = () => {
    if (selectedTrainee) {
      const totalMarks = calculateTotal();
      const grade = calculateGrade();
      
      updateTrainee(selectedTrainee, {
        marks,
        totalMarks,
        grade
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const generatePDF = () => {
    if (!selectedTraineeData) return;
    
    const content = `
STC TRAINING MANAGEMENT SYSTEM
SUPERVISORS TRAINING CENTRE - NORTHERN RAILWAY

OFFICIAL MARKSHEET

Student Information:
Name: ${selectedTraineeData.fullName}
Student ID: ${selectedTraineeData.id}
Ticket Number: ${selectedTraineeData.ticketNumber}
Module: ${selectedTraineeData.moduleNumber}
Batch: ${selectedTraineeData.batch}
Designation: ${selectedTraineeData.designation}
Course Duration: ${selectedTraineeData.courseDuration}
Stream: ${selectedTraineeData.stream}

THEORY SUBJECTS:
${subjects.slice(0, 6).map(subject => 
  `${subject.label}: ${marks[subject.key as keyof Marks]}/100`
).join('\n')}

PRACTICAL SUBJECTS:
${subjects.slice(6).map(subject => 
  `${subject.label}: ${marks[subject.key as keyof Marks]}/100`
).join('\n')}

RESULT SUMMARY:
Total Marks: ${calculateTotal()}/1100
Percentage: ${calculatePercentage()}%
Grade: ${calculateGrade()}
Result: ${parseFloat(calculatePercentage()) >= 50 ? 'PASS' : 'FAIL'}

Date of Issue: ${new Date().toLocaleDateString()}
Place: Supervisors Training Centre, Northern Railway

This is a computer-generated marksheet and does not require signature.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marksheet_${selectedTraineeData.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">Marksheet saved successfully!</p>
          </div>
        </div>
      )}

      {/* Trainee Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Trainee for Marksheet</h2>
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
              onClick={generatePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          )}
        </div>
        
        {selectedTraineeData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-900">Name:</span>
                <span className="ml-2 text-blue-800">{selectedTraineeData.fullName}</span>
              </div>
              <div>
                <span className="font-medium text-blue-900">Module:</span>
                <span className="ml-2 text-blue-800">{selectedTraineeData.moduleNumber}</span>
              </div>
              <div>
                <span className="font-medium text-blue-900">Designation:</span>
                <span className="ml-2 text-blue-800">{selectedTraineeData.designation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedTrainee && (
        <>
          {/* Marks Entry */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Marks</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 text-base">Theory Subjects</h4>
              {subjects.slice(0, 6).map((subject) => (
                <div key={subject.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">{subject.label}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[subject.key as keyof Marks]}
                      onChange={(e) => handleMarkChange(subject.key, parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    <span className="text-gray-600">/ {subject.maxMarks}</span>
                  </div>
                </div>
              ))}
              
              <h4 className="font-medium text-gray-900 text-base mt-6">Practical Subjects</h4>
              {subjects.slice(6).map((subject) => (
                <div key={subject.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">{subject.label}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[subject.key as keyof Marks]}
                      onChange={(e) => handleMarkChange(subject.key, parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    <span className="text-gray-600">/ {subject.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{calculateTotal()}</p>
                <p className="text-sm text-blue-700">Total Marks</p>
                <p className="text-xs text-blue-600">out of 1100</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{calculatePercentage()}%</p>
                <p className="text-sm text-green-700">Percentage</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-900">{calculateGrade()}</p>
                <p className="text-sm text-purple-700">Grade</p>
              </div>
              
              <div className={`p-4 rounded-lg text-center ${
                parseFloat(calculatePercentage()) >= 50 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`text-lg font-bold ${
                  parseFloat(calculatePercentage()) >= 50 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {parseFloat(calculatePercentage()) >= 50 ? 'PASS' : 'FAIL'}
                </p>
                <p className={`text-sm ${
                  parseFloat(calculatePercentage()) >= 50 ? 'text-green-700' : 'text-red-700'
                }`}>Result Status</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveMarks}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Save Marksheet
              </button>
            </div>
          </div>
        </>
      )}

      {/* My Trainees Marksheets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Marksheets</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Student Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Module</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Marks</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Percentage</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTrainees.map((trainee) => (
                <tr key={trainee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{trainee.fullName}</td>
                  <td className="py-3 px-4 text-gray-600">{trainee.id}</td>
                  <td className="py-3 px-4 text-gray-600">{trainee.moduleNumber}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {trainee.totalMarks ? `${trainee.totalMarks}/1100` : 'Not entered'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {trainee.totalMarks ? `${((trainee.totalMarks / 1100) * 100).toFixed(2)}%` : '-'}
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
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {trainee.marks ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : (
                      <span className="text-orange-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedTrainee(trainee.id);
                        setTimeout(generatePDF, 100);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      disabled={!trainee.marks}
                    >
                      <Download className="h-4 w-4" />
                      Download
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