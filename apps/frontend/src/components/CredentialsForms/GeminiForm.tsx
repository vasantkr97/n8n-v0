import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCredentials, postCredentials, deleteCredentials } from "../../apiServices/credentials.api";

// Filter credentials by platform
const getGeminiCredentials = async () => {
  const response = await getCredentials();
  const allCredentials = response.credentials || [];
  return allCredentials.filter((cred: any) => cred.platform === 'gemini');
};

const createGeminiCredential = async (formData: { title: string; apiKey: string }) => {
  return await postCredentials({
    title: formData.title,
    platform: 'gemini',
    data: { apiKey: formData.apiKey }
  });
};

const deleteGeminiCredential = async (id: string) => {
  return await deleteCredentials(id);
};

export function GeminiCredentials() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", apiKey: "" });

  const { data: credentials, isLoading } = useQuery({
    queryKey: ["geminiCredentials"],
    queryFn: getGeminiCredentials,
  });

  const createMutation = useMutation({
    mutationFn: createGeminiCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiCredentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      setShowForm(false);
      setFormData({ title: "", apiKey: "" });
      alert('✅ Gemini credential saved successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create credential:', error);
      alert(`❌ Failed to save: ${error.response?.data?.msg || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGeminiCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geminiCredentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });

  if (isLoading) {
    return (
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          <p className="text-gray-400">Loading Gemini credentials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">✨</span>
        <h2 className="text-xl font-bold">Gemini AI Credentials</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {credentials?.map((cred: any) => (
          <div
            key={cred.id}
            className="bg-gray-700 rounded-lg p-4 flex justify-between items-start hover:bg-gray-650 transition-colors border border-gray-600"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-white">{cred.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(cred.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(cred.id)}
              className="text-gray-400 hover:text-red-400 transition-colors ml-2 p-1"
              title="Delete credential"
            >
              🗑️
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium border-2 border-dashed border-blue-500 hover:border-blue-400"
        >
          <span className="text-xl mr-2">+</span>
          Add Gemini Credential
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              New Gemini Credential
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Credential Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Gemini API Key"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  API Key *
                </label>
                <input
                  type="password"
                  placeholder="AIza..."
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get your API key from Google AI Studio
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-600 hover:border-gray-500 rounded-lg py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!formData.title || !formData.apiKey || createMutation.isPending}
                onClick={() => createMutation.mutate(formData)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
