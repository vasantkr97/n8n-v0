export function EmailParams({ data, setData }: any) {
    const params = data.parameters || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentialsId || ""}
            onChange={(e) => setData({ ...data, credentialsId: e.target.value })}
            placeholder="SMTP Credentials"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">From</label>
          <input
            type="email"
            value={params.from || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, from: e.target.value } })}
            placeholder="you@example.com"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">To</label>
          <input
            type="email"
            value={params.to || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, to: e.target.value } })}
            placeholder="recipient@example.com"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Subject</label>
          <input
            type="text"
            value={params.subject || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, subject: e.target.value } })}
            placeholder="Subject line"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Text</label>
          <textarea
            value={params.text || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, text: e.target.value } })}
            placeholder="Plain text content"
            className="w-full border rounded px-2 py-1 h-24"
          />
        </div>
        <div>
          <label className="block font-medium">HTML</label>
          <textarea
            value={params.html || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, html: e.target.value } })}
            placeholder="<p>HTML content</p>"
            className="w-full border rounded px-2 py-1 h-24"
          />
        </div>
      </div>
    );
  }
  