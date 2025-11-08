import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  TsmlServerConfig,
  TsmlApiError,
  GetMeetingsParams,
  TypeaheadParams,
  GeocodeParams,
  FeedbackParams,
  GetMeetingsResponse,
  TypeaheadResponse,
  GeocodeResponse,
  FeedbackResponse,
} from './types.js';

export class TsmlApiClient {
  private axiosInstance: AxiosInstance;
  private config: TsmlServerConfig;
  private ajaxUrl: string;

  constructor(config: TsmlServerConfig) {
    this.config = {
      timeout: 30000,
      userAgent: 'TSML-MCP-Server/1.0.0',
      ...config
    };

    // Construct WordPress AJAX URL
    const baseUrl = this.config.wordpressUrl.replace(/\/$/, '');
    this.ajaxUrl = `${baseUrl}/wp-admin/admin-ajax.php`;

    this.axiosInstance = axios.create({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent
      }
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.error(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const tsmlError: TsmlApiError = new Error(
          error.response?.data?.message || error.message || 'API request failed'
        );
        tsmlError.status = error.response?.status;
        tsmlError.response = error.response;
        return Promise.reject(tsmlError);
      }
    );
  }

  private buildUrl(action: string, params: Record<string, any> = {}): string {
    const queryParams = new URLSearchParams();
    
    queryParams.append('action', action);
    
    // Add API key if configured
    if (this.config.apiKey) {
      queryParams.append('key', this.config.apiKey);
    }

    // Handle array parameters and other params
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          queryParams.append(`${key}[]`, item.toString());
        });
      } else {
        queryParams.append(key, value.toString());
      }
    });

    return `${this.ajaxUrl}?${queryParams.toString()}`;
  }

  private async makeRequest<T>(
    action: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' = 'GET'
  ): Promise<T> {
    const url = this.buildUrl(action, method === 'GET' ? params : {});
    
    try {
      let response: AxiosResponse<T>;
      
      if (method === 'POST') {
        // For POST requests, send params as form data
        const formData = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        
        response = await this.axiosInstance.post(url, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } else {
        response = await this.axiosInstance.get(url);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error making request to ${action}:`, error);
      throw error;
    }
  }

  /**
   * Search for meetings with various filtering options
   * GET/POST /wp-admin/admin-ajax.php?action=meetings
   */
  async getMeetings(
    params: GetMeetingsParams = {}
  ): Promise<GetMeetingsResponse> {
    return this.makeRequest<GetMeetingsResponse>('meetings', params);
  }

  /**
   * Get typeahead suggestions for search autocomplete
   * GET/POST /wp-admin/admin-ajax.php?action=tsml_typeahead
   */
  async getTypeahead(
    params: TypeaheadParams = {}
  ): Promise<TypeaheadResponse> {
    return this.makeRequest<TypeaheadResponse>('tsml_typeahead', params);
  }

  /**
   * Geocode an address to coordinates
   * GET /wp-admin/admin-ajax.php?action=tsml_geocode
   * Note: Requires nonce for authentication
   */
  async geocode(
    params: GeocodeParams
  ): Promise<GeocodeResponse> {
    return this.makeRequest<GeocodeResponse>('tsml_geocode', params);
  }

  /**
   * Submit feedback about a meeting
   * POST /wp-admin/admin-ajax.php?action=tsml_feedback
   * Note: Requires nonce for authentication
   */
  async submitFeedback(
    params: FeedbackParams
  ): Promise<FeedbackResponse> {
    return this.makeRequest<FeedbackResponse>('tsml_feedback', params, 'POST');
  }

  /**
   * Helper method to search meetings by day of week
   */
  async getMeetingsByDay(day: number): Promise<GetMeetingsResponse> {
    return this.getMeetings({ day });
  }

  /**
   * Helper method to search meetings by type
   */
  async getMeetingsByType(type: string | string[]): Promise<GetMeetingsResponse> {
    return this.getMeetings({ type });
  }

  /**
   * Helper method to search meetings near coordinates
   */
  async getMeetingsNear(
    latitude: number,
    longitude: number,
    distance: number = 2,
    distanceUnits: 'mi' | 'km' = 'mi'
  ): Promise<GetMeetingsResponse> {
    return this.getMeetings({
      latitude,
      longitude,
      distance,
      distance_units: distanceUnits,
    });
  }

  /**
   * Helper method to search meetings by region
   */
  async getMeetingsByRegion(region: string | number): Promise<GetMeetingsResponse> {
    return this.getMeetings({ region });
  }

  /**
   * Helper method to search meetings by text query
   */
  async searchMeetings(query: string): Promise<GetMeetingsResponse> {
    return this.getMeetings({ query });
  }

  /**
   * Helper method to get online meetings
   */
  async getOnlineMeetings(): Promise<GetMeetingsResponse> {
    return this.getMeetings({ attendance_option: 'online' });
  }

  /**
   * Helper method to get in-person meetings
   */
  async getInPersonMeetings(): Promise<GetMeetingsResponse> {
    return this.getMeetings({ attendance_option: 'in_person' });
  }

  /**
   * Helper method to get hybrid meetings
   */
  async getHybridMeetings(): Promise<GetMeetingsResponse> {
    return this.getMeetings({ attendance_option: 'hybrid' });
  }
}
