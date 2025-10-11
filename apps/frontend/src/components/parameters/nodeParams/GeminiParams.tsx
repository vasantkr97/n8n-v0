import { CredentialsSelector } from '../CredentialsSelector';

export function GeminiParams({ data, setData }: any) {
  const params = data.parameters || {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Credentials *
        </label>
        <CredentialsSelector
          credentialType="gemini"
          selectedCredentialId={data.credentialsId}
          onChange={(credentialId) => setData({ ...data, credentialsId })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Select Gemini API credentials or create new ones in Credentials page
        </p>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Prompt *
        </label>
        <textarea
          value={params.prompt || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, prompt: e.target.value } })}
          placeholder="Enter your prompt here..."
          rows={4}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The prompt to send to Gemini AI
        </p>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={params.model || "gemini-1.5-flash"}
          onChange={(e) => setData({ ...data, parameters: { ...params, model: e.target.value } })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Temperature
        </label>
        <input
          type="number"
          min="0"
          max="2"
          step="0.1"
          value={params.temperature || 0.7}
          onChange={(e) => setData({ ...data, parameters: { ...params, temperature: parseFloat(e.target.value) } })}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Controls randomness (0-2). Lower = more focused, Higher = more creative
        </p>
      </div>
    </div>
  );
}
