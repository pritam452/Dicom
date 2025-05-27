import axios from 'axios';

// Orthanc server configuration
const ORTHANC_URL = 'http://localhost:8042';
const ORTHANC_USERNAME = 'orthanc'; // Default Orthanc credentials
const ORTHANC_PASSWORD = 'orthanc';

// Configure axios instance for Orthanc
const orthancApi = axios.create({
  baseURL: ORTHANC_URL,
  auth: {
    username: ORTHANC_USERNAME,
    password: ORTHANC_PASSWORD
  }
});

export interface OrthancStudy {
  ID: string;
  ParentPatient: string;
  MainDicomTags: {
    StudyDate: string;
    StudyDescription: string;
    PatientName: string;
    PatientID: string;
    AccessionNumber: string;
    StudyInstanceUID: string;
    NumberOfStudyRelatedSeries: string;
  };
}

export interface OrthancSeries {
  ID: string;
  ParentStudy: string;
  MainDicomTags: {
    SeriesDescription: string;
    Modality: string;
    SeriesNumber: string;
    SeriesInstanceUID: string;
    NumberOfSeriesRelatedInstances: string;
  };
}

export interface OrthancInstance {
  ID: string;
  FileSize: number;
  FileUuid: string;
  IndexInSeries: number;
  MainDicomTags: {
    SOPInstanceUID: string;
    InstanceNumber: string;
  };
}

class OrthancService {
  // Get all studies
  async getStudies(): Promise<OrthancStudy[]> {
    const response = await orthancApi.get('/studies');
    const studyIds = response.data;
    
    const studies = await Promise.all(
      studyIds.map(async (id: string) => {
        const studyResponse = await orthancApi.get(`/studies/${id}`);
        return studyResponse.data;
      })
    );
    
    return studies;
  }

  // Get series for a study
  async getSeriesForStudy(studyId: string): Promise<OrthancSeries[]> {
    const response = await orthancApi.get(`/studies/${studyId}/series`);
    const seriesIds = response.data;
    
    const series = await Promise.all(
      seriesIds.map(async (id: string) => {
        const seriesResponse = await orthancApi.get(`/series/${id}`);
        return seriesResponse.data;
      })
    );
    
    return series;
  }

  // Get instances for a series
  async getInstancesForSeries(seriesId: string): Promise<OrthancInstance[]> {
    const response = await orthancApi.get(`/series/${seriesId}/instances`);
    const instanceIds = response.data;
    
    const instances = await Promise.all(
      instanceIds.map(async (id: string) => {
        const instanceResponse = await orthancApi.get(`/instances/${id}`);
        return instanceResponse.data;
      })
    );
    
    return instances;
  }

  // Get DICOM file URL for an instance
  getDicomFileUrl(instanceId: string): string {
    return `${ORTHANC_URL}/instances/${instanceId}/file`;
  }

  // Get preview image URL for an instance
  getPreviewUrl(instanceId: string): string {
    return `${ORTHANC_URL}/instances/${instanceId}/preview`;
  }

  // Get WADO URI for an instance
  getWadoUrl(studyUID: string, seriesUID: string, instanceUID: string): string {
    return `${ORTHANC_URL}/wado?requestType=WADO&studyUID=${studyUID}&seriesUID=${seriesUID}&objectUID=${instanceUID}&contentType=application/dicom`;
  }

  // Check if Orthanc is available
  async checkOrthancAvailability(): Promise<boolean> {
    try {
      await orthancApi.get('/system');
      return true;
    } catch (error) {
      console.error('Orthanc server is not available:', error);
      return false;
    }
  }
}

export const orthancService = new OrthancService();