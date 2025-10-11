import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCredentials, postCredentials } from '../../apiServices/credentials.api';

interface CredentialsSelectorProps {
  credentialType: string;
  selectedCredentialId?: string;
  onChange: (credentialId: string) => void;
}

export function CredentialsSelector({ 
  credentialType, 
  selectedCredentialId, 
  onChange 
}: CredentialsSelectorProps) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const { data: response, isLoading } = useQuery({
    queryKey: ['credentials', credentialType],
    queryFn: getCredentials,
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMutation = useMutation({
    mutationFn: postCredentials,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      setShowCreateForm(false);
      setFormData({});
      // Automatically select the newly created credential
      const newId = data?.data?.id || data?.id;
      if (newId) {
        onChange(newId);
        alert('✅ Credential saved successfully!');
      }
    },
    onError: (error: any) => {
      console.error('Failed to create credential:', error);
      alert(`❌ Failed to save credential: ${error.response?.data?.msg || error.message}`);
    },
  });

  const credentials = response?.credentials?.filter(
    (cred: any) => {
      const platformMatch = cred.platform.toLowerCase() === credentialType.toLowerCase() ||
                           cred.platform.toLowerCase().includes(credentialType.toLowerCase()) ||
                           credentialType.toLowerCase().includes(cred.platform.toLowerCase());
      return platformMatch;
    }
  ) || [];

  const handleCreateCredential = () => {
    if (!formData.title) return;
    
    const credentialData: any = {
      title: formData.title,
      platform: credentialType,
    };

    // Map form data based on credential type
    if (credentialType.toLowerCase() === 'telegram') {
      if (!formData.botToken) return;
      credentialData.data = { botToken: formData.botToken };
    } else if (credentialType.toLowerCase() === 'gemini') {
      if (!formData.apiKey) return;
      credentialData.data = { apiKey: formData.apiKey };
    } else if (credentialType.toLowerCase() === 'email') {
      if (!formData.apiKey || !formData.fromEmail) return;
      credentialData.data = { 
        apiKey: formData.apiKey,
        fromEmail: formData.fromEmail 
      };
    }

    createMutation.mutate(credentialData);
  };

  const isFormValid = () => {
    if (!formData.title) return false;
    
    const type = credentialType.toLowerCase();
    if (type === 'telegram') return !!formData.botToken;
    if (type === 'gemini') return !!formData.apiKey;
    if (type === 'email') return !!(formData.apiKey && formData.fromEmail);
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 flex items-center">
        <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading credentials...
      </div>
    );
  }

  const renderCreateForm = () => {
    if (!showCreateForm) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold mb-2 text-blue-900">
          Create New {credentialType.charAt(0).toUpperCase() + credentialType.slice(1)} Credential
        </h4>
        
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              placeholder={`e.g., My ${credentialType}`}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {credentialType.toLowerCase() === 'telegram' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bot Token *
              </label>
              <input
                type="password"
                placeholder="1234567890:ABCdef..."
                value={formData.botToken || ''}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-0.5">From @BotFather on Telegram</p>
            </div>
          )}

          {credentialType.toLowerCase() === 'gemini' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                API Key *
              </label>
              <input
                type="password"
                placeholder="AIza..."
                value={formData.apiKey || ''}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-0.5">From Google AI Studio</p>
            </div>
          )}

          {credentialType.toLowerCase() === 'email' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Resend API Key *
                </label>
                <input
                  type="password"
                  placeholder="re_..."
                  value={formData.apiKey || ''}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From Email *
                </label>
                <input
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={formData.fromEmail || ''}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex space-x-2 pt-1">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setFormData({});
              }}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCredential}
              disabled={createMutation.isPending || !isFormValid()}
              className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? 'Saving...' : 'Save & Select'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <select
        value={selectedCredentialId || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '__create_new__') {
            setShowCreateForm(true);
          } else {
            onChange(value);
            setShowCreateForm(false);
          }
        }}
        className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
          selectedCredentialId ? 'border-green-400 bg-green-50' : 'border-gray-300'
        }`}
      >
        <option value="">Select Credential</option>
        {credentials.map((cred: any) => (
          <option key={cred.id} value={cred.id}>
            {cred.title}
          </option>
        ))}
        <option value="__create_new__">+ Create new credential</option>
      </select>

      {renderCreateForm()}
    </div>
  );
}

