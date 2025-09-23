import { GeminiCredentials } from "../components/CredentialsForms/GeminiForm";
import { ResendCredentials } from "../components/CredentialsForms/ResendCredentials";
import { TelegramCredentials } from "../components/CredentialsForms/TelegramCredentials";

export default function Credentials() {
  return (
    <div className="h-full p-6 bg-gray-700 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Credentials</h1>
        <p className="text-gray-300 mb-6">
          Manage your API keys and authentication credentials
        </p>

        {/* Each section is separate */}
        <GeminiCredentials />
        <TelegramCredentials />
        <ResendCredentials />
      </div>
    </div>
  );
}
