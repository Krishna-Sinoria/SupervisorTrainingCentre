
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { useData } from '../../context/DataContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics() {
  const { getAnalytics, trainers, trainees } = useData();
  const analytics = getAnalytics();

  const activeTrainersCount = trainers.filter(t => t.active).length;
  const completedTrainees = trainees.filter(t => t.grade && t.grade !== '').length;
  const completionRate = trainees.length > 0 ? Math.round((completedTrainees / trainees.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Trainees</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalTrainees}</p>
          <p className="text-sm text-gray-600 mt-1">Enrolled this year</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Trainers</h3>
          <p className="text-3xl font-bold text-green-600">{activeTrainersCount}</p>
          <p className="text-sm text-gray-600 mt-1">Currently active</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Average completion</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Trainers</h3>
          <p className="text-3xl font-bold text-indigo-600">{trainers.length}</p>
          <p className="text-sm text-gray-600 mt-1">All trainers</p>
        </div>
      </div>

      {/* Pie & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainees by Course Duration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.courseDistribution}
                cx="50%" cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment per Module</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.moduleEnrollment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Join Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.monthlyEnrollment}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="enrollments" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trainer Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trainer Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Trainees</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Completed</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Success Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => {
                const trainerTrainees = trainees.filter(t => t.trainerId === trainer.id);
                const completedCount = trainerTrainees.filter(t => t.grade && t.grade !== '').length;
                const successRate = trainerTrainees.length > 0 ? Math.round((completedCount / trainerTrainees.length) * 100) : 0;

                return (
                  <tr key={trainer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{trainer.name}</td>
                    <td className="py-3 px-4 text-gray-600">{trainer.department || 'Not specified'}</td>
                    <td className="py-3 px-4 text-gray-600">{trainerTrainees.length}</td>
                    <td className="py-3 px-4 text-gray-600">{completedCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        successRate >= 80 ? 'bg-green-100 text-green-800' :
                        successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        trainer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trainer.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Most Popular Course</h4>
            <p className="text-blue-700 mt-1">
              {analytics.courseDistribution.length > 0 
                ? `${analytics.courseDistribution[0].name} programs attract most trainees`
                : 'No course data available'}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">High Performance</h4>
            <p className="text-green-700 mt-1">
              Overall completion rate is {completionRate}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">Trainer Capacity</h4>
            <p className="text-purple-700 mt-1">
              {activeTrainersCount} active trainers managing {trainees.length} trainees
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900">Top Module</h4>
            <p className="text-orange-700 mt-1">
              {analytics.moduleEnrollment.length > 0 
                ? `${analytics.moduleEnrollment[0].module} module has highest demand`
                : 'No module data available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
