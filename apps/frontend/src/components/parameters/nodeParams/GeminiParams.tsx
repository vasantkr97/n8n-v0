export function GeminiParams({ data, setData }: any) {
    const params = data.parameters || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentialsId || ""}
            onChange={(e) => setData({ ...data, credentialsId: e.target.value })}
            placeholder="Gemini API Key"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Prompt</label>
          <input
            type="text"
            value={params.prompt || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, prompt: e.target.value } })}
            placeholder="Input from previous node"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Model</label>
          <input
            type="text"
            value={params.model || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, model: e.target.value } })}
            placeholder="gemini-1.5-flash"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Temperature</label>
          <input
            type="number"
            step="0.1"
            value={(params.temperature ?? "")}
            onChange={(e) => setData({ ...data, parameters: { ...params, temperature: Number(e.target.value) } })}
            placeholder="0.7"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }
  