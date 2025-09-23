export function TelegramParams({ data, setData }: any) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Credentials</label>
          <input
            type="text"
            value={data.credentials || ""}
            onChange={(e) => setData({ ...data, credentials: e.target.value })}
            placeholder="Telegram Bot Token"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Chat ID</label>
          <input
            type="text"
            value={data.chatId || ""}
            onChange={(e) => setData({ ...data, chatId: e.target.value })}
            placeholder="123456789"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Message</label>
          <input
            type="text"
            value={data.message || ""}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            placeholder="Message to send"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }
  