import { CredentialsSelector } from '../CredentialsSelector';

export function TelegramParams({ data, setData }: any) {
  const params = data.parameters || {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Credentials *
        </label>
        <CredentialsSelector
          credentialType="telegram"
          selectedCredentialId={data.credentialsId}
          onChange={(credentialId) => {
            console.log('🔧 Setting credential ID:', credentialId);
            setData({ ...data, credentialsId });
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Select Telegram bot credentials or create new ones in Credentials page
        </p>
        {data.credentialsId && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
            ✅ Credential selected: {data.credentialsId}
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Chat ID *
        </label>
        <input
          type="text"
          value={params.chatId || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, chatId: e.target.value } })}
          placeholder="123456789"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The Telegram chat ID to send the message to
        </p>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          value={params.message || ""}
          onChange={(e) => setData({ ...data, parameters: { ...params, message: e.target.value } })}
          placeholder="Enter your message here..."
          rows={4}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The message text to send
        </p>
      </div>
    </div>
  );
}
