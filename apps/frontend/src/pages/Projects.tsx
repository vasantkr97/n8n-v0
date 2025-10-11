import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getallWorkflows, deleteWorkflow } from '../apiServices/workflow.api';

interface Workflow {
  id: string;
  title: string;
  isActive: boolean;
  triggerType: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    executions: number;
  };
  executions?: Array<{
    id: string;
    status: string;
    mode: string;
  }>;
}

export default function Projects() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflows from backend
  const fetchWorkflows = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getallWorkflows();
      console.log('Workflows fetched:', response);
      setWorkflows(response.data || []);
    } catch (err: any) {
      console.error('Error fetching workflows:', err);
      setError(err.response?.data?.error || 'Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateNew = () => {
    navigate('/dashboard');
  };

  const handleOpenWorkflow = (workflowId: string) => {
    navigate(`/workflow/${workflowId}`);
  };

  const handleDeleteWorkflow = async (workflowId: string, workflowTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${workflowTitle}"?`)) {
      return;
    }

    try {
      await deleteWorkflow(workflowId);
      alert('Workflow deleted successfully');
      // Refresh the list
      fetchWorkflows();
    } catch (err: any) {
      console.error('Error deleting workflow:', err);
      alert(`Failed to delete workflow: ${err.response?.data?.error || err.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-lg text-white">Loading workflows...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900">
        <div className="text-red-400 text-lg mb-4">Error: {error}</div>
        <button
          onClick={fetchWorkflows}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">My Workflows</h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage and organize your automation workflows
            </p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span className="text-lg">+</span>
            <span className="font-semibold">New Workflow</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {workflows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-white mb-2">No workflows yet</h3>
            <p className="text-gray-400 mb-6">
              Get started by creating your first workflow
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Your First Workflow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-700 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {workflow.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {workflow.triggerType}
                      </p>
                    </div>
                    <div className="ml-2">
                      {workflow.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-700 text-green-100">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Executions:</span>
                      <span className="text-white font-semibold">
                        {workflow._count?.executions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Updated:</span>
                      <span className="text-white">
                        {formatDate(workflow.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Recent Executions */}
                  {workflow.executions && workflow.executions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Recent executions:</p>
                      <div className="flex gap-1">
                        {workflow.executions.slice(0, 5).map((execution) => (
                          <span
                            key={execution.id}
                            className={`inline-block w-2 h-2 rounded-full ${
                              execution.status === 'SUCCESS' ? 'bg-green-500' :
                              execution.status === 'FAILED' ? 'bg-red-500' :
                              execution.status === 'RUNNING' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            title={execution.status}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-750 border-t border-gray-700 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenWorkflow(workflow.id)}
                    className="px-3 py-1.5 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(workflow.id, workflow.title)}
                    className="px-3 py-1.5 text-red-400 hover:text-red-300 font-semibold text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

