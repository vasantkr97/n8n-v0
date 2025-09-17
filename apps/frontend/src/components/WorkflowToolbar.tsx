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
    if (e.key === 'Enter') {
      handleTitleSubmit();
    }
    if (e.key === 'Escape') {
      setTempTitle(workflowTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
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
              className="text-xl font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none min-w-48"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit workflow name"
            >
              {workflowTitle || 'Untitled Workflow'}
            </h1>
          )}
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit workflow name"
          >
            ✏️
          </button>
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Status:</span>
          <button
            onClick={onToggleActive}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isWorkflowActive
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isWorkflowActive ? '🟢 Active' : '⚪ Inactive'}
          </button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2">
        {/* New Workflow */}
        <button
          onClick={onNewWorkflow}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
          title="Create new workflow"
        >
          <span>📄</span>
          <span>New</span>
        </button>

        {/* Save Workflow */}
        <button
          onClick={onSaveWorkflow}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          title="Save workflow"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save</span>
            </>
          )}
        </button>

        {/* Execute Workflow */}
        <button
          onClick={onExecuteWorkflow}
          disabled={!isWorkflowActive || isExecuting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          title={isWorkflowActive ? "Execute workflow" : "Activate workflow to execute"}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Executing...</span>
            </>
          ) : (
            <>
              <span>▶️</span>
              <span>Execute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
