import { useState } from 'react';

interface WorkflowToolbarProps {
  workflowTitle: string;
  onWorkflowTitleChange: (title: string) => void;
  onSaveWorkflow: () => void;
  onNewWorkflow: () => void;
  onExecuteWorkflow: () => void;
  isWorkflowActive: boolean;
  onToggleActive: () => void;
  isSaving: boolean;
  isExecuting: boolean;
}

export const WorkflowToolbar = ({
  workflowTitle,
  onWorkflowTitleChange,
  onSaveWorkflow,
  onNewWorkflow,
  onExecuteWorkflow,

  isWorkflowActive,
  onToggleActive,
  isSaving,
  isExecuting
}: WorkflowToolbarProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workflowTitle);

  const handleTitleSubmit = () => {
    onWorkflowTitleChange(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setTempTitle(workflowTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-950 border-b border-gray-700 shadow-md">
      {/* Left side - Title and controls */}
      <div className="flex items-center space-x-4">
        {/* Workflow Title */}
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="text-xl font-semibold bg-gray-800 text-white border-b-2 border-blue-500 focus:outline-none  px-1 py-0.5"
              autoFocus
            />
          ) : (
            <h1
              className="text-base font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit workflow name"
            >
              {workflowTitle || 'Untitled Workflow'}
            </h1>
          )}
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            title="Edit workflow name"
          >
      
          </button>
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Status:</span>
          <button
            onClick={onToggleActive}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isWorkflowActive
                ? 'bg-green-700 text-green-100 hover:bg-green-600'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isWorkflowActive ? '🟢 Active' : '⚪ Inactive'}
          </button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-3">
        {/* New Workflow */}
        <button
          onClick={onNewWorkflow}
          className="px-2.5 py-1.5 text-gray-200 hover:text-white bg-orange-600 hover:bg-orange-800 rounded-lg transition-colors flex items-center space-x-2"
          title="Create new workflow"
        >
          <span className='font-semibold'>New Workflow</span>
        </button>

        {/* Save Workflow */}
        <button
          onClick={onSaveWorkflow}
          disabled={isSaving}
          className="px-3 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-center space-x-2"
          title="Save workflow"
        >
          {isSaving ? (
            <>
              <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className='font-semibold'>Save</span>
            </>
          )}
        </button>

        {/* Execute Workflow */}
        <button
          onClick={onExecuteWorkflow}
          disabled={!isWorkflowActive || isExecuting}
          className="px-3 py-1 bg-green-700 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          title={isWorkflowActive ? "Execute workflow" : "Activate workflow to execute"}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className='font-semibold'>Executing...</span>
            </>
          ) : (
            <>
              <span className='font-semibold'>Execute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkflowToolbar;
