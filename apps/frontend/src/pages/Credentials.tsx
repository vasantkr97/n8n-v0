import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const getCredentials = async () => {
  // This should call your credentials API
  return [];
};

const createCredential = async (data: any) => {
  // This should call your credentials API
  return data;
};

const deleteCredential = async (id: string) => {
  // This should call your credentials API
  return { id };
};

export default function Credentials() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCredential, setNewCredential] = useState({
    title: '',
    platform: 'googleApi',
    data: {}
  });

  const queryClient = useQueryClient();

  const { data: credentials, isLoading } = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials
  });

  const createMutation = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      setShowCreateForm(false);
      setNewCredential({ title: '', platform: 'googleApi', data: {} });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    }
  });

  const platforms = [
    { value: 'googleApi', label: 'Google API' },
    { value: 'stripeApi', label: 'Stripe API' },
    { value: 'slackApi', label: 'Slack API' },
    { value: 'httpAuth', label: 'HTTP Authentication' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-700">
        <div className="text-lg text-gray-300">Loading credentials...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-gray-700 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Credentials</h1>
            <p className="text-gray-300">
              Manage your API keys and authentication credentials
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            
            <span className='font-semibold'>Add Credential</span>
          </button>
        </div>

        {/* Credentials List */}
        {credentials && credentials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((credential: any) => (
              <div
                key={credential.id}
                className="bg-gray-800 rounded-lg border border-gray-600 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
                      🔑
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{credential.title}</h3>
                      <p className="text-gray-300 text-sm">{credential.platform}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(credential.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(credential.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-200">
            <h3 className="text-lg font-semibold mb-2">No credentials yet</h3>
            <p className="mb-4 text-gray-300">
              Add your first credential to start connecting to external services
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-3 py-1.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Credential
            </button>
          </div>
        )}

        {/* Create Credential Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 text-white">
              <h2 className="text-xl font-semibold mb-4">Add New Credential</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Credential Name</label>
                  <input
                    type="text"
                    value={newCredential.title}
                    onChange={(e) =>
                      setNewCredential((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="My API Credential"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={newCredential.platform}
                    onChange={(e) =>
                      setNewCredential((prev) => ({ ...prev, platform: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">API Key / Token</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Enter your API key"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMutation.mutate(newCredential)}
                  disabled={!newCredential.title}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
