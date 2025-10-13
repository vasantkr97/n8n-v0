import { memo, useEffect, useState } from 'react';
// useReactFlow is already imported in the main import block
import { CredentialsSelector } from '../parameters/CredentialsSelector';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const GeminiAgentNode = memo(({ data, selected, id }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  return (
    <div className="relative group">
      {/* Delete Button - Shows on hover, positioned above node */}
      <button
        onClick={handleDelete}
        className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        title="Delete node"
      >
        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Gemini Agent Node Container - Rectangle shape */}
      <div
        className={`relative bg-gray-600 w-40 h-24 border-2 transition-all duration-300 flex items-center justify-center rounded-lg ${
          (data as any)?.isExecuting || (data as any)?.isExecuted
            ? 'border-green-500'
            : (selected ? 'border-gray-500 shadow-lg scale-105' : 'border-white shadow-md')
        } ${(data as any)?.isExecuting || (data as any)?.isExecuted ? '' : 'hover:border-orange-500'} hover:shadow-lg hover:scale-102`}
      >
        {/* Input Handle */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200"
          />
        )}

        {/* Main Output Handle - Right center */}
        <Handle
          type="source"
          position={Position.Right}
          id="main-output"
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
        />

        {/* Multiple Output Handles - Bottom edge */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '25%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '50%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '75%', bottom: '-6px' }}
        />

        {/* AI Agent Icon - Professional single color */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Config Popover - anchored above node */}
      {(data as any)?.showConfig && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-3">
          <div className="text-xs font-semibold text-gray-200 mb-2">Quick Config</div>
          <GeminiQuickConfig id={id} data={data} />
        </div>
      )}

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-40 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
          {(data as any)?.label || 'Gemini AI'}
        </div>
      </div>
    </div>
  );
});

GeminiAgentNode.displayName = 'GeminiAgentNode';
export default GeminiAgentNode;

function GeminiQuickConfig({ id, data }: any) {
  const rf = useReactFlow();
  const [local, setLocal] = useState({
    credentialsId: data?.credentialsId || '',
    parameters: { ...(data?.parameters || {}) },
  });

  useEffect(() => {
    setLocal({
      credentialsId: data?.credentialsId || '',
      parameters: { ...(data?.parameters || {}) },
    });
  }, [id]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Credentials</label>
        <CredentialsSelector
          credentialType="gemini"
          selectedCredentialId={local.credentialsId}
          onChange={(cid: string) => setLocal((l) => ({ ...l, credentialsId: cid }))}
          compact
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">API Key</label>
        <input
          type="password"
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.apiKey || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), apiKey: e.target.value } }))}
          placeholder="AIza..."
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Prompt</label>
        <textarea
          rows={3}
          className="w-full border rounded px-2 py-1.5 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          value={(local.parameters as any)?.prompt || ''}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), prompt: e.target.value } }))}
          placeholder="Enter your prompt..."
        />
      </div>
      <label className="inline-flex items-center gap-2 text-[11px] text-gray-300">
        <input
          type="checkbox"
          className="accent-orange-500"
          checked={Boolean((local.parameters as any)?.usePreviousResult)}
          onChange={(e) => setLocal((l) => ({ ...l, parameters: { ...(l.parameters || {}), usePreviousResult: e.target.checked } }))}
        />
        Use previous node result
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => {
            setLocal({
              credentialsId: data?.credentialsId || '',
              parameters: { ...(data?.parameters || {}) },
            });
          }}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if ((data as any)?.onQuickUpdate) {
              (data as any).onQuickUpdate({ credentialsId: local.credentialsId, parameters: local.parameters });
            } else {
              rf.setNodes((nodes: any[]) => nodes.map((n: any) => {
                if (n.id !== id) return n;
                return {
                  ...n,
                  data: {
                    ...n.data,
                    credentialsId: local.credentialsId || undefined,
                    parameters: { ...(n.data?.parameters || {}), ...(local.parameters || {}) },
                  }
                };
              }));
            }
            rf.setNodes((nodes: any[]) => nodes.map((n: any) => (n.id === id ? { ...n, data: { ...n.data, showConfig: false } } : n)));
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-orange-600 text-white hover:bg-orange-700"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
