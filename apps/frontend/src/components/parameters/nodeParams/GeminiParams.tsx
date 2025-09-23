export function GeminiParams({ data, setData }: any) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentials || ""}
            onChange={(e) => setData({ ...data, credentials: e.target.value })}
            placeholder="Gemini API Key"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Prompt</label>
          <input
            type="text"
            value={data.prompt || ""}
            onChange={(e) => setData({ ...data, prompt: e.target.value })}
            placeholder="Input from previous node"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }
  