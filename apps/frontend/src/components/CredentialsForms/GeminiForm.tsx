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
      setShowForm(false);
      setFormData({ title: "", apiKey: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGeminiCredential,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["geminiCredentials"] }),
  });

  if (isLoading) return <p>Loading Gemini credentials...</p>;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3">Gemini Credentials</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {credentials?.map((cred: any) => (
          <div
            key={cred.id}
            className="bg-gray-800 rounded-lg p-4 flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{cred.title}</h3>
              <p className="text-sm text-gray-400">
                Created: {new Date(cred.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(cred.id)}
              className="text-gray-400 hover:text-red-500"
            >
              🗑️
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Gemini Credential
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">New Gemini Credential</h3>
            <input
              type="text"
              placeholder="Name"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600"
            />
            <input
              type="password"
              placeholder="Gemini API Key"
              value={formData.apiKey}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
              }
              className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-600 rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                disabled={!formData.title || !formData.apiKey}
                onClick={() => createMutation.mutate(formData)}
                className="flex-1 bg-blue-600 rounded-lg py-2 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
