
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, SparklesIcon } from 'lucide-react';
const AssignmentList = () => {
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');
    const [batchFilter, setBatchFilter] = React.useState('All Students');
    const [batchOptions, setBatchOptions] = React.useState<string[]>(['All Students']);
  const [statusFilter, setStatusFilter] = React.useState('All Statuses');
  const [page, setPage] = React.useState(1);
  const pageSize = 5;

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAssignments = () => {
      setLoading(true);
      fetch('http://localhost:8000/assignment/list', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        .then(res => {
          if (res.status === 401) {
            setError('Not authenticated. Please log in.');
            setLoading(false);
            return Promise.reject(new Error('Not authenticated'));
          }
          if (!res.ok) throw new Error('Failed to fetch assignments');
          return res.json();
        })
        .then(data => {
          setAssignments(data.assignments || []);
          setLoading(false);
        })
        .catch(err => {
          setError('Error loading assignments');
          setLoading(false);
        });

      // fetch available batch options from backend
      fetch('http://localhost:8000/assignment/options', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to fetch batches')))
        .then(d => {
          const batches: string[] = d.batches || ['All Students'];
          setBatchOptions(batches);
          // ensure current filter is a valid option
          if (!batches.includes(batchFilter)) setBatchFilter(batches[0] || 'All Students');
        })
        .catch(() => {
          // keep default options on failure
        });

      return fetchAssignments;
    };

    // initial fetch
    const fetcher = fetchAssignments();

    // listen for external updates
    const onUpdate = (e: any) => {
      fetchAssignments();
    };
    window.addEventListener('assignment:updated', onUpdate as EventListener);
    return () => window.removeEventListener('assignment:updated', onUpdate as EventListener);
  }, []);

  // Filter assignments
  const filtered = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchesBatch = batchFilter === 'All Students' || batchFilter === 'All Batches' || a.batch === batchFilter;
    const matchesStatus = statusFilter === 'All Statuses' || (a.status ? a.status === statusFilter : true);
    return matchesSearch && matchesBatch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleBatch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBatchFilter(e.target.value);
    setPage(1);
  };
  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-500">
            Manage all your programming assignments
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/assignments/generate"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition"
          >
            <SparklesIcon size={16} className="mr-2" />
            Generate Assignment with AI
          </Link>
          <Link
            to="/assignments/create"
            className="inline-flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800"
          >
            <PlusIcon size={16} className="mr-2" />
            Create Assignment
          </Link>
        </div>
      </div>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input type="text" value={search} onChange={handleSearch} placeholder="Search assignments..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700" disabled>
              <FilterIcon size={16} className="mr-2" />
              Filters
            </button>
              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700" value={batchFilter} onChange={handleBatch}>
                {batchOptions.map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700" value={statusFilter} onChange={handleStatus}>
              <option>All Statuses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading assignments...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No assignments found.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">TITLE</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">BATCH</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">DUE DATE</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">LANGUAGE</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">DIFFICULTY</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(assignment => (
                  <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link to={`/assignments/${assignment.id}`} className="font-medium text-[#0D47A1] hover:underline">
                        {assignment.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm">{assignment.batch}</td>
                    <td className="py-3 px-4 text-sm">{assignment.dueDate ? `${assignment.dueDate}${assignment.dueTime ? ' ' + assignment.dueTime : ''}` : '-'}</td>
                    <td className="py-3 px-4 text-sm">{assignment.language || '-'}</td>
                    <td className="py-3 px-4 text-sm">{assignment.difficulty || '-'}</td>
                    <td className="py-3 px-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontalIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            {filtered.length === 0 ? 'No assignments' : `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} of ${filtered.length} assignments`}
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50" disabled={page === totalPages || filtered.length === 0} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>;
};
export default AssignmentList;