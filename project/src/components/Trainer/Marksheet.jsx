import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, Calculator, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Marksheet() {
  const { user } = useAuth();
  const { getTraineesByTrainer, updateTrainee } = useData();
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [subjects, setSubjects] = useState([
    { key: 'railwayOrganization', label: 'Railway Organization & Management', maxMarks: 100, type: 'theory' },
    { key: 'mechanicalDepartmentRole', label: 'Role of Mechanical Department', maxMarks: 100, type: 'theory' },
    { key: 'rollingStockCarriage', label: 'Rolling Stock Theory – Carriage', maxMarks: 100, type: 'theory' },
    { key: 'rollingStockWagon', label: 'Rolling Stock Theory – Wagon', maxMarks: 100, type: 'theory' },
    { key: 'rollingStockDiesel', label: 'Rolling Stock Theory – Diesel Loco, DEMU, SPART, Train Sets (MEMU/EMU)', maxMarks: 100, type: 'theory' },
    { key: 'industrialSafety', label: 'Industrial Safety, First Aid & Firefighting', maxMarks: 100, type: 'theory' },
    { key: 'coachProduction', label: 'Coach Production Unit', maxMarks: 100, type: 'practical' },
    { key: 'rwf', label: 'RWF', maxMarks: 100, type: 'practical' },
    { key: 'demuSpart', label: 'DEMU/SPART Manufacturing Unit', maxMarks: 100, type: 'practical' },
    { key: 'dieselProduction', label: 'Diesel Production Units', maxMarks: 100, type: 'practical' },
    { key: 'rdso', label: 'RDSO', maxMarks: 100, type: 'practical' }
  ]);

  const [marks, setMarks] = useState({});
  const [newSubjectLabel, setNewSubjectLabel] = useState('');
  const [newSubjectType, setNewSubjectType] = useState('theory');
  const [newSubjectMax, setNewSubjectMax] = useState(100);

  const myTrainees = getTraineesByTrainer(user?.id || '');
  const selectedTraineeData = myTrainees.find(t => t.id === Number(selectedTrainee));

  useEffect(() => {
    const initialMarks = {};
    subjects.forEach(sub => {
      initialMarks[sub.key] = selectedTraineeData?.marks?.[sub.key] || 0;
    });
    setMarks(initialMarks);
  }, [selectedTraineeData, subjects]);

  const calculateTotal = () => subjects.reduce((sum, sub) => sum + (marks[sub.key] || 0), 0);
  const calculateMaxTotal = () => subjects.reduce((sum, sub) => sum + parseInt(sub.maxMarks), 0);
  const calculatePercentage = () => ((calculateTotal() / calculateMaxTotal()) * 100).toFixed(2);
  const calculateGrade = () => {
    const percentage = parseFloat(calculatePercentage());
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleMarkChange = (key, value) => {
    setMarks(prev => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const handleAddSubject = () => {
    if (!newSubjectLabel.trim()) return;
    const newKey = newSubjectLabel.toLowerCase().replace(/\s+/g, '_');
    setSubjects(prev => [...prev, { key: newKey, label: newSubjectLabel, maxMarks: parseInt(newSubjectMax), type: newSubjectType }]);
    setMarks(prev => ({ ...prev, [newKey]: 0 }));
    setNewSubjectLabel('');
    setNewSubjectType('theory');
    setNewSubjectMax(100);
  };

  const handleDeleteSubject = (key) => {
    setSubjects(prev => prev.filter(sub => sub.key !== key));
    setMarks(prev => {
      const newMarks = { ...prev };
      delete newMarks[key];
      return newMarks;
    });
  };

 const handleSaveMarks = async () => {
  if (!selectedTrainee || !selectedTraineeData) return;

  const dataToSave = {
    traineeId: selectedTraineeData.id,
    traineeName: selectedTraineeData.fullName,
    trainerId: user?.id,
    marks: marks,
    total: calculateTotal(),
    maxTotal: calculateMaxTotal(),
    percentage: calculatePercentage(),
    grade: calculateGrade(),
    result: parseFloat(calculatePercentage()) >= 50 ? 'PASS' : 'FAIL',
    issuedDate: new Date().toISOString().split('T')[0]
  };

  try {
    const response = await fetch('http://localhost:5000/api/marksheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave)
    });

    if (response.ok) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Failed to save marksheet to database.");
    }
  } catch (error) {
    console.error("Error saving marksheet:", error);
    alert("An error occurred while saving the marksheet.");
  }

  // Update trainee's local data as well
  updateTrainee(selectedTrainee, {
    marks,
    totalMarks: calculateTotal(),
    grade: calculateGrade()
  });
};
const saveMarksheetToDB = async () => {
  try {
    const res = await fetch('/api/marksheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traineeId: selectedTraineeData.id,
        marks,
        total: calculateTotal(),
        percentage: calculatePercentage(),
        grade: calculateGrade()
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    console.log('Marksheet saved to DB:', data);
  } catch (err) {
    console.error('Failed to save marksheet to DB:', err.message);
    alert('❌ Failed to save marksheet to database.');
  }
};



  const generatePDF = () => {
    if (!selectedTraineeData) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = new Image();
    logo.src = '/STC_logo.png';

    logo.onload = () => {
      doc.addImage(logo, 'PNG', 12, 8, 20, 20);

      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('STC TRAINING MANAGEMENT SYSTEM', pageWidth / 2, 15, { align: 'center' });
      doc.text('SUPERVISORS TRAINING CENTRE - NORTHERN RAILWAY', pageWidth / 2, 22, { align: 'center' });
      doc.text('OFFICIAL MARKSHEET', pageWidth / 2, 30, { align: 'center' });

      doc.setFontSize(10);

      let y = 40;
      doc.text(`Name: ${selectedTraineeData.fullName}`, 14, y); y += 6;
      doc.text(`Student ID: ${selectedTraineeData.id}`, 14, y); y += 6;
      doc.text(`Father's Name: ${selectedTraineeData.fatherName}`, 14, y); y += 6;
      doc.text(`Mother's Name: ${selectedTraineeData.motherName}`, 14, y); y += 6;
      doc.text(`Category: ${selectedTraineeData.category}`, 14, y); y += 6;
      doc.text(`Date of Birth: ${selectedTraineeData.dateOfBirth}`, 14, y); y += 6;
      doc.text(`Batch: ${selectedTraineeData.batch}`, 14, y); y += 6;
      doc.text(`Course Duration: ${selectedTraineeData.courseDuration}`, 14, y); y += 8;

      const theory = subjects.filter(s => s.type === 'theory').map(s => [s.label, `${marks[s.key] || 0} / ${s.maxMarks}`]);
      const practical = subjects.filter(s => s.type === 'practical').map(s => [s.label, `${marks[s.key] || 0} / ${s.maxMarks}`]);

      autoTable(doc, { head: [['Theory Subjects', 'Marks']], body: theory, startY: 90, columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } } });
      const afterTheory = doc.lastAutoTable.finalY + 10;
      autoTable(doc, { head: [['Practical Subjects', 'Marks']], body: practical, startY: afterTheory, columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } } });
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.text(`Total Marks: ${calculateTotal()} / ${calculateMaxTotal()}`, 14, finalY);
      doc.text(`Percentage: ${calculatePercentage()}%`, 14, finalY + 6);
      doc.text(`Grade: ${calculateGrade()}`, 14, finalY + 12);
      doc.text(`Result: ${parseFloat(calculatePercentage()) >= 50 ? 'PASS' : 'FAIL'}`, 14, finalY + 18);

      doc.setFont('times', 'bold');
      const issueLine = `Date of Issue: ${new Date().toLocaleDateString()}`;
      const issuedByLine = 'Issued by: Supervisors Training Centre, Northern Railway';
      doc.text(issueLine, (pageWidth - doc.getTextWidth(issueLine)) / 2, finalY + 26);
      doc.text(issuedByLine, (pageWidth - doc.getTextWidth(issuedByLine)) / 2, finalY + 32);

      doc.save(`marksheet_${selectedTraineeData.id}_${new Date().toISOString().split('T')[0]}.pdf`);
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Generate Marksheet</h2>

      <label className="block mb-3 font-medium">Select Trainee:</label>
      <select className="mb-6 w-full border px-3 py-2 rounded" value={selectedTrainee} onChange={(e) => setSelectedTrainee(e.target.value)}>
        <option value="">-- Select --</option>
        {myTrainees.map(t => (
          <option key={t.id} value={t.id}>{t.fullName}</option>
        ))}
      </select>

      {selectedTrainee && (
        <>
          <div className="flex gap-3 items-center mb-4">
            <input type="text" placeholder="New Subject Name" value={newSubjectLabel} onChange={(e) => setNewSubjectLabel(e.target.value)} className="border px-2 py-1 rounded w-full" />
            <select value={newSubjectType} onChange={(e) => setNewSubjectType(e.target.value)} className="border px-2 py-1 rounded">
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
            </select>
            <input type="number" min="1" placeholder="Max Marks" value={newSubjectMax} onChange={(e) => setNewSubjectMax(e.target.value)} className="border px-2 py-1 rounded w-24" />
            <button onClick={handleAddSubject} className="bg-blue-600 text-white px-3 py-2 rounded">
              <Plus className="h-4 w-4 inline mr-1" /> Add Subject
            </button>
          </div>

          <table className="w-full table-auto mb-6 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Marks</th>
                <th className="p-2 text-left">Max</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, idx) => (
                <tr key={subject.key}>
                  <td className="p-2 border">{subject.label}</td>
                  <td className="p-2 border">
                    <input type="number" value={marks[subject.key] || 0} min={0} onChange={(e) => handleMarkChange(subject.key, parseInt(e.target.value))} className="border px-2 py-1 w-20 rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="number" value={subject.maxMarks} min={1} onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].maxMarks = parseInt(e.target.value);
                      setSubjects(updated);
                    }} className="border px-2 py-1 w-20 rounded" />
                  </td>
                  <td className="p-2 border">
                    <select value={subject.type} onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].type = e.target.value;
                      setSubjects(updated);
                    }} className="border px-2 py-1 rounded">
                      <option value="theory">Theory</option>
                      <option value="practical">Practical</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <button onClick={() => handleDeleteSubject(subject.key)} className="text-red-600 hover:underline">
                      <X className="h-4 w-4 inline" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-4">
            <strong>Total:</strong> {calculateTotal()} / {calculateMaxTotal()}<br />
            <strong>Percentage:</strong> {calculatePercentage()}%<br />
            <strong>Grade:</strong> {calculateGrade()}
          </div>

          <div className="flex gap-4">
            <button onClick={handleSaveMarks} className="bg-green-600 text-white px-4 py-2 rounded">
              <CheckCircle className="inline w-4 h-4 mr-2" /> Save Marks
            </button>
            <button onClick={generatePDF} className="bg-blue-600 text-white px-4 py-2 rounded">
              <Download className="inline w-4 h-4 mr-2" /> Download Marksheet
            </button>
          </div>

          {showSuccess && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              Marks updated successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
}
