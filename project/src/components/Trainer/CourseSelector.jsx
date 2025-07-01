import React, { useState, useEffect } from 'react';

const stcCourses = [
  { code: "ASE/AJE", title: "Induction Course for ASE/AJE", duration: "52 weeks", category: "Regular" },
  { code: "IJE", title: "Promotional Course for IJE", duration: "52 weeks", category: "Regular" },
  { code: "RJE", title: "Promotional Course for RJE", duration: "13 weeks", category: "Regular" },
  { code: "RCW", title: "Refresher Course for SSEs & JEs / C&W", duration: "2 weeks", category: "Refresher" },
  { code: "RD", title: "Refresher Course for SSEs & JEs / Diesel", duration: "2 weeks", category: "Refresher" },
  { code: "TS", title: "Trainset Maintenance", duration: "1 week", category: "Special" },
  { code: "LH-I", title: "LHB Coach Maintenance (I)", duration: "1 week", category: "Special" },
  { code: "LH-II", title: "LHB Coach Maintenance (II)", duration: "1 week", category: "Special" },
  { code: "FM", title: "Freight maintenance + new Wagons", duration: "1 week", category: "Special" },
  { code: "WT", title: "Excellence in Welding Tech", duration: "5 days", category: "Special" },
  { code: "DM", title: "Disaster Management", duration: "5 days", category: "Special" },
  { code: "WE", title: "Wayside Equipments", duration: "5 days", category: "Special" },
  { code: "NDT", title: "NDT and DT for Mechanical", duration: "5 days", category: "Special" },
  { code: "EA", title: "Intro to Electronics & Control", duration: "5 days", category: "Special" },
  { code: "3DMP", title: "3D Modelling & Printing", duration: "5 days", category: "Special" },
];

export default function CourseSelector({ onSelect }) {
  const [category, setCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [customCourse, setCustomCourse] = useState({
    code: '',
    title: '',
    duration: ''
  });

  const isManual = selectedCourse === 'manual';
  const categories = ['Regular', 'Refresher', 'Special'];

  const filteredCourses = stcCourses.filter(course => course.category === category);

  useEffect(() => {
  if (isManual) {
    onSelect({
      course: customCourse,
      category
    });
  } else {
    const selected = stcCourses.find(c => c.code === selectedCourse);
    if (selected) {
      onSelect({
        course: selected,
        category: selected.category // ensure correct category is sent
      });
    }
  }
}, [selectedCourse, customCourse, isManual, category]);
  return (
    <div className="space-y-6">
      {/* Category Dropdown */}
      <div>
        <label className="block font-semibold text-gray-700">Select Category:</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedCourse('');
          }}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat} Courses</option>
          ))}
        </select>
      </div>

      {/* Course Dropdown */}
      {category && (
        <div>
          <label className="block font-semibold text-gray-700">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Course --</option>
            {filteredCourses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.title} ({course.duration})
              </option>
            ))}
            <option value="manual">Other (Manual Entry)</option>
          </select>
        </div>
      )}

      {/* Manual Entry Fields */}
      {isManual && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Course Code"
            className="w-full border px-3 py-2 rounded"
            value={customCourse.code}
            onChange={(e) => setCustomCourse({ ...customCourse, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Course Title"
            className="w-full border px-3 py-2 rounded"
            value={customCourse.title}
            onChange={(e) => setCustomCourse({ ...customCourse, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Course Duration"
            className="w-full border px-3 py-2 rounded"
            value={customCourse.duration}
            onChange={(e) => setCustomCourse({ ...customCourse, duration: e.target.value })}
          />
        </div>
      )}

      {/* Selected Course Preview */}
      {/* {!isManual && selectedCourse && (
        <div className="p-4 border rounded bg-gray-50">
          <p><strong>Course Code:</strong> {selectedCourse}</p>
          <p><strong>Course Title:</strong> {stcCourses.find(c => c.code === selectedCourse)?.title}</p>
          <p><strong>Duration:</strong> {stcCourses.find(c => c.code === selectedCourse)?.duration}</p>
        </div>
      )} */}
    </div>
  );
}