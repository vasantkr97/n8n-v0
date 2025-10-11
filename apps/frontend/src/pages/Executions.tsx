import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExecutions, deleteExecution, stopExecution } from '../apiServices/execution.api';
import ExecutionDetailsModal from '../components/ExecutionDetailsModal';

interface Execution {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  mode: string;
  createdAt: string;
  finishedAt?: string;
  workflow: {
    id: string;
    title: string;
    triggerType: string;
  };
}

export default function Executions() {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

  // Fetch executions from backend
  const fetchExecutions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllExecutions();
      console.log('Executions fetched:', response);
      setExecutions(response.executions || []);
    } catch (err: any) {
      console.error('Error fetching executions:', err);
      setError(err.response?.data?.error || 'Failed to load executions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
    // Refresh every 5 seconds to show real-time updates
    const interval = setInterval(fetchExecutions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelExecution = async (executionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this execution?')) {
      return;
    }

    try {
      await stopExecution(executionId);
      alert('Execution cancelled successfully');
      fetchExecutions();
    } catch (err: any) {
      console.error('Error cancelling execution:', err);
      alert(`Failed to cancel execution: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteExecution = async (executionId: string) => {
    if (!window.confirm('Are you sure you want to delete this execution?')) {
      return;
    }

    try {
      await deleteExecution(executionId);
      alert('Execution deleted successfully');
      fetchExecutions();
    } catch (err: any) {
      console.error('Error deleting execution:', err);
      alert(`Failed to delete execution: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleViewWorkflow = (workflowId: string) => {
    navigate(`/workflow/${workflowId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-700 text-green-100';
      case 'FAILED': return 'bg-red-700 text-red-100';
      case 'RUNNING': return 'bg-blue-700 text-blue-100';
      case 'PENDING': return 'bg-yellow-700 text-yellow-100';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDuration = (createdAt: string, finishedAt?: string) => {
    const start = new Date(createdAt);
    const end = finishedAt ? new Date(finishedAt) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  // Filter executions by status
  const filteredExecutions = statusFilter 
    ? executions.filter(e => e.status === statusFilter)
    : executions;

  if (isLoading && executions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-lg text-white">Loading executions...</div>
      </div>
    );
  }

  if (error && executions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900">
        <div className="text-red-400 text-lg mb-4">Error: {error}</div>
        <button
          onClick={fetchExecutions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-700 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Executions</h1>
            <p className="text-sm text-gray-400 mt-1">
              View and manage workflow executions
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RUNNING">Running</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
            <button
              onClick={fetchExecutions}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {filteredExecutions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-white mb-2">No executions found</h3>
            <p className="text-gray-400">
              {statusFilter 
                ? `No executions found with status "${statusFilter}"`
                : "Execute a workflow to see executions here"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Executions Table */}
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Workflow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredExecutions.map((execution: Execution) => (
                    <tr key={execution.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {execution.workflow.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              {execution.workflow.triggerType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {execution.mode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(execution.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {getDuration(execution.createdAt, execution.finishedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          className="text-purple-400 hover:text-purple-300"
                          onClick={() => setSelectedExecutionId(execution.id)}
                          title="View execution details and results"
                        >
                          Details
                        </button>
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => handleViewWorkflow(execution.workflow.id)}
                        >
                          View Workflow
                        </button>
                        {execution.status === 'RUNNING' && (
                          <button
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => handleCancelExecution(execution.id)}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteExecution(execution.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredExecutions.length} of {executions.length} executions
              {isLoading && <span className="ml-2">(refreshing...)</span>}
            </div>
          </>
        )}
      </div>

      {/* Execution Details Modal */}
      {selectedExecutionId && (
        <ExecutionDetailsModal
          executionId={selectedExecutionId}
          onClose={() => setSelectedExecutionId(null)}
        />
      )}
    </div>
  );
}
