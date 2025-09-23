export function EmailParams({ data, setData }: any) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentials || ""}
            onChange={(e) => setData({ ...data, credentials: e.target.value })}
            placeholder="SMTP Credentials"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">From</label>
          <input
            type="email"
            value={data.from || ""}
            onChange={(e) => setData({ ...data, from: e.target.value })}
            placeholder="you@example.com"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">To</label>
          <input
            type="email"
            value={data.to || ""}
            onChange={(e) => setData({ ...data, to: e.target.value })}
            placeholder="recipient@example.com"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Subject</label>
          <input
            type="text"
            value={data.subject || ""}
            onChange={(e) => setData({ ...data, subject: e.target.value })}
            placeholder="Subject line"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }
  