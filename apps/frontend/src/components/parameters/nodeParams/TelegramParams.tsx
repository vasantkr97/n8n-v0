export function TelegramParams({ data, setData }: any) {
    const params = data.parameters || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentialsId || ""}
            onChange={(e) => setData({ ...data, credentialsId: e.target.value })}
            placeholder="Telegram Bot Token"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Chat ID</label>
          <input
            type="text"
            value={params.chatId || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, chatId: e.target.value } })}
            placeholder="123456789"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Message</label>
          <input
            type="text"
            value={params.message || ""}
            onChange={(e) => setData({ ...data, parameters: { ...params, message: e.target.value } })}
            placeholder="Message to send"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }
  