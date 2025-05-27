import { useState, useEffect } from 'react';
import { orthancService, OrthancStudy } from '../services/orthancService';

export function useOrthanc() {
  const [studies, setStudies] = useState<OrthancStudy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOrthancAvailable, setIsOrthancAvailable] = useState(false);

  useEffect(() => {
    checkOrthancStatus();
  }, []);

  const checkOrthancStatus = async () => {
    const available = await orthancService.checkOrthancAvailability();
    setIsOrthancAvailable(available);
  };

  const loadStudies = async () => {
    if (!isOrthancAvailable) return;

    setIsLoading(true);
    setError(null);

    try {
      const orthancStudies = await orthancService.getStudies();
      setStudies(orthancStudies);
    } catch (err) {
      setError('Failed to load studies from Orthanc');
      console.error('Error loading studies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStudies = () => {
    loadStudies();
  };

  return {
    studies,
    isLoading,
    error,
    isOrthancAvailable,
    refreshStudies
  };
}