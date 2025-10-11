import { GeminiCredentials } from "../components/CredentialsForms/GeminiForm";
import { ResendCredentials } from "../components/CredentialsForms/ResendCredentials";
import { TelegramCredentials } from "../components/CredentialsForms/TelegramCredentials";

export default function Credentials() {
  return (
    <div className="h-full p-6 bg-gray-700 text-white overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            🔐 Credentials
          </h1>
          <p className="text-gray-400 text-base">
            Manage your API keys and authentication credentials for different services
          </p>
        </div>

        <div className="space-y-6">
          <GeminiCredentials />
          <TelegramCredentials />
          <ResendCredentials />
        </div>
      </div>
    </div>
  );
}
