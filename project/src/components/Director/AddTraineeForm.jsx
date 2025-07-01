import React from 'react';
import { useState,useEffect } from 'react';
import { Save, Upload, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import CourseSelector from './CourseSelector';


/Ensure your backend API accepts all these fields/ 
export default function AddTraineeForm() {
  const { user } = useAuth();
  const { addTrainee, generateTraineeId, generateTicketNumber, trainers } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    photo: '',
    serialNo: '',
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    dateOfAppointment: '',
    dateOfSparing: '',
    category: '',
    bloodGroup: '',
    maritalStatus: '',
    employeeName: '',
    pfNumber: '',
    nationality: 'Indian',
    modeOfAppointment: '',
    batch: '2024-25',
    selectCategory: '',  // ✅ Add this
    selectCourse: '', 
    courseDuration: '',
    stream: '',
    unit: '',
    workingUnder: '',
    customWorkingUnder: '',//add this line
    stationCode: '',
    courseTitle:'',
    phoneNumber: '',
    email: '',
    address: '',
   class10Marks: '',
  class12Marks: '',
  degreeType: '',       // e.g., Bachelor, Diploma, Postgraduate
  degreeName: '',       // e.g., B.Tech, M.Sc
  graduationMarks: '',
  });

  const [selectedCourseDetails,setSelectedCourseDetails]=useState({
    code:'',
    title:'',
    duration:''
  })


  // Get all active trainers for the dropdown
  const activeTrainers = trainers.filter(trainer => trainer.active);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill course duration based on module
    if (name === 'moduleNumber') {
      let duration = '';
      if (value === 'MSE-C') duration = '52 weeks';
      else if (value === 'MJI-W' || value === 'MJI-D') duration = '13 weeks';
      
      setFormData(prev => ({
        ...prev,
        courseDuration: duration
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photo: event.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'serialNo', 'fullName', 'fatherName', 'motherName', 'dateOfBirth',
      'dateOfAppointment', 'dateOfSparing', 'category', 'bloodGroup',
      'maritalStatus', 'employeeName', 'pfNumber', 'modeOfAppointment',
     'unit', 'workingUnder',
      'stationCode', 'phoneNumber', 'email', 'address','class10Marks',
  'class12Marks','degreeType','degreeName','graduationMarks',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addTrainee({
        ...formData,
        trainerId: user?.id || ''
      });

      // Reset form
      setFormData({
        photo: '',
        serialNo: '',
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        dateOfAppointment: '',
        dateOfSparing: '',
        category: '',
        bloodGroup: '',
        maritalStatus: '',
        employeeName: '',
        pfNumber: '',
        nationality: 'Indian',
        modeOfAppointment: '',
        batch: '2024-25',
        selectCategory: '',  // ✅ Add this
        selectCourse: '',  
        courseDuration: '',
        unit: '',
        workingUnder: '',
        stationCode: '',
        phoneNumber: '',
        email: '',
        address: '',
        class10Marks: '',
        class12Marks: '',
        degreeType: '',       // e.g., Bachelor, Diploma, Postgraduate
        degreeName: '',       // e.g., B.Tech, M.Sc
        graduationMarks: '',
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Error adding trainee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-6 mb-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">Trainee added successfully!</p>
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Add New Trainee</h2>
        <p className="text-sm text-gray-600 mt-1">
          Fill in all required information to register a new trainee
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Auto-generated fields preview */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Auto-generated Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Trainee ID:</span>
              <span className="ml-2 text-blue-700">{generateTraineeId()}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Ticket Number:</span>
              <span className="ml-2 text-blue-700">{generateTicketNumber()}</span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Size Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Trainee" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial No. *
              </label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name *
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Name *
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Appointment in Railway *
              </label>
              <input
                type="date"
                name="dateOfAppointment"
                value={formData.dateOfAppointment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Sparing *
              </label>
              <input
                type="date"
                name="dateOfSparing"
                value={formData.dateOfSparing}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status *
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name *
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PF/NPS/UPS No. *
              </label>
              <input
                type="text"
                name="pfNumber"
                value={formData.pfNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Appointment *
              </label>
              <select
                name="modeOfAppointment"
                value={formData.modeOfAppointment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Mode</option>
                <option value="RRB">RRB</option>
                <option value="LDCE">LDCE</option>
                <option value="Seniority">Seniority</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch *
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

           
  <div>
  
  <CourseSelector
  onSelect={({ course, category }) => {
    setSelectedCourseDetails(course);
    setFormData(prev => ({
      ...prev,
      courseTitle: course.title,
      courseDuration: course.duration,
      selectCourse: course.code,
      selectCategory: category // ✅ category like "Refresher", "Regular", "Special"
    }));
  }}
/>
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Duration *
              </label>
              <input
                type="text"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-filled based on module"
                required
              />
            </div>

         
          </div>
        </div>

        {/* Work Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Unit</option>
                <option value="JAT">JAT</option>
                <option value="FZR">FZR</option>
                <option value="DLI">DLI</option>
                <option value="MB">MB</option>
                <option value="LKO">LKO</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Under *
              </label>
              <select
                name="workingUnder"
                value={formData.workingUnder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Trainer</option>
                {activeTrainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.name}>
                    {trainer.name} - {trainer.position} ({trainer.department})
                  </option>
                ))}
                <option value="Other">Other (Manual Entry)</option>
              </select>
            </div>

            {formData.workingUnder === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Working Under *
                </label>
                <input
                  type="text"
                  name="workingUnder"
                  value={formData.customWorkingUnder || ''} //some fixation
                  onChange={(e) => setFormData(prev => ({ ...prev, workingUnder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter custom supervisor name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station Code *
              </label>
              <input
                type="text"
                name="stationCode"
                value={formData.stationCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Educational Qualification *
              </label>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Class 10 Marks (%) *
  </label>
  <input
    type="number"
    name="class10Marks"
    value={formData.class10Marks}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., 85.6"
    required
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Class 12 Marks (%) *
  </label>
  <input
    type="number"
    name="class12Marks"
    value={formData.class12Marks}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., 87.2"
    required
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Degree Type *
  </label>
  <select
    name="degreeType"
    value={formData.degreeType}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    required
  >
    <option value="">Select Type</option>
    <option value="Bachelor">Bachelor</option>
    <option value="Postgraduate">Postgraduate</option>
    <option value="Diploma">Diploma</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Degree Name *
  </label>
  <input
    type="text"
    name="degreeName"
    value={formData.degreeName}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., B.Tech, M.Sc"
    required
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Graduation/Postgraduation Marks (%) *
  </label>
  <input
    type="number"
    name="graduationMarks"
    value={formData.graduationMarks}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., 75.4"
    required
  />
</div>
 
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                setFormData({
                  photo: '',
                  serialNo: '',
                  fullName: '',
                  fatherName: '',
                  motherName: '',
                  dateOfBirth: '',
                  dateOfAppointment: '',
                  dateOfSparing: '',
                  category: '',
                  bloodGroup: '',
                  maritalStatus: '',
                  employeeName: '',
                  pfNumber: '',
                  nationality: 'Indian',
                  modeOfAppointment: '',
                  batch: '2024-25',
                  selectCategory: '',
                  selectCourse: '',
                  courseDuration: '',
                  workingUnder: '',
                  stationCode: '',
                  phoneNumber: '',
                  email: '',
                  address: '',
                  class10Marks: '',
        class12Marks: '',
        degreeType: '',
        degreeName: '',
        graduationMarks: ''
                });
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Trainee'}
          </button>
        </div>
      </form>
    </div>
  );
}