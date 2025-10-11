import { useState, useEffect } from "react";
import { GeminiParams } from "./nodeParams/GeminiParams";
import { TelegramParams } from "./nodeParams/TelegramParams";
import { EmailParams } from "./nodeParams/EmailParams";
import GenericParams from "./nodeParams/GenericParams";

export function NodeParametersPanel({ node, onClose, onSave }: any) {
  const [localData, setLocalData] = useState(node.data || {});
  
  // Sync local data with node data only when the node ID changes (i.e., different node selected)
  // This prevents resetting localData when parent re-renders but keeps the same node
  useEffect(() => {
    setLocalData(node.data || {});
  }, [node.id]);

  const handleSave = () => {
    onSave(node.id, localData);
    onClose();
  };

  const renderParams = () => {
    switch (node.type) {
      case "gemini":
        return <GeminiParams data={localData} setData={setLocalData} />;
      case "telegram":
        return <TelegramParams data={localData} setData={setLocalData} />;
      case "email":
        return <EmailParams data={localData} setData={setLocalData} />;
      default:
        return <GenericParams data={localData} setData={setLocalData} />;
    }
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Configure {node.type}</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">{renderParams()}</div>

      <div className="p-4 border-t flex justify-end space-x-2">
        <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}
