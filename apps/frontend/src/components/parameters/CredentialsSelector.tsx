import { useEffect, useState } from 'react';
import { getCredentials } from '../../apiServices/credentials.api';

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
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
        const response = await getCredentials();
        console.log('🔍 Credentials API response:', response);
        console.log('🔍 Looking for credential type:', credentialType);
        console.log('🔍 All credentials:', response.credentials);
        
        const filtered = response.credentials?.filter(
          (cred: any) => cred.platform.toLowerCase() === credentialType.toLowerCase()
        ) || [];
        
        console.log('🔍 Filtered credentials:', filtered);
        
        // If no filtered results, show all credentials for debugging
        if (filtered.length === 0 && response.credentials?.length > 0) {
          console.log('⚠️ No filtered credentials found, showing all for debugging');
          setCredentials(response.credentials);
        } else {
          setCredentials(filtered);
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [credentialType]);

  if (isLoading) {
    return (
      <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-500">
        Loading credentials...
      </div>
    );
  }

  return (
    <select
      value={selectedCredentialId || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select credentials...</option>
      {credentials.map((cred) => (
        <option key={cred.id} value={cred.id}>
          {cred.title} ({cred.platform}) - ID: {cred.id}
        </option>
      ))}
      {credentials.length === 0 && (
        <option value="" disabled>
          No {credentialType} credentials found
        </option>
      )}
    </select>
  );
}

