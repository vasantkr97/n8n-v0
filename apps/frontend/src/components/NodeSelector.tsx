import { useState, useEffect } from 'react';
import { getNodeConfig } from './nodes/nodeTypes';

interface NodeSelectorProps {
  position: { x: number; y: number };
  onNodeSelect: (nodeType: string) => void;
  onClose: () => void;
  isVisible: boolean;
  hasTrigger: boolean;
}

const nodeCategories = {
  'Triggers': ['manual', 'webhook'],
  'Actions': ['telegram', 'email', 'gemini'],
};

export const NodeSelector = ({ position, onNodeSelect, onClose, isVisible, hasTrigger }: NodeSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(hasTrigger ? 'Actions' : 'Triggers');
  const [searchTerm, setSearchTerm] = useState('');

  // Update selected category when hasTrigger changes
  useEffect(() => {
    setSelectedCategory(hasTrigger ? 'Actions' : 'Triggers');
  }, [hasTrigger]);

  if (!isVisible) return null;

  const availableCategories = hasTrigger ? { Actions: nodeCategories.Actions } : nodeCategories;


  const filteredNodes = searchTerm 
    ? Object.values(availableCategories).flat().filter(nodeType => 
        nodeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNodeConfig(nodeType).label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableCategories[selectedCategory as keyof typeof availableCategories] || [];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-20"
        onClick={onClose}
      />
      
      {/* Node Selector Panel */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.min(position.y, window.innerHeight - 500),
          width: '380px',
          height: '450px'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Add Node</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <div className="flex h-full">
          {/* Categories (only show if no search) */}
          {!searchTerm && (
            <div className="w-32 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              {Object.keys(availableCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full px-3 py-3 text-left text-sm border-b border-gray-200 transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-r-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Nodes List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid gap-2">
              {filteredNodes.map((nodeType) => {
                const config = getNodeConfig(nodeType);
                return (
                  <button
                    key={nodeType}
                    onClick={() => onNodeSelect(nodeType)}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {config.label}
                      </div>
                      <div className="text-xs text-gray-500 overflow-hidden" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {config.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {filteredNodes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm">No nodes found</div>
                <div className="text-xs">Try a different search term</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
