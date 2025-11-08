// Configuration for TSML API client
export interface TsmlServerConfig {
  wordpressUrl: string; // Base WordPress site URL
  apiKey?: string; // Optional API key for authentication
  timeout?: number; // Request timeout in milliseconds
  userAgent?: string; // Custom user agent
}

// TSML API error type
export interface TsmlApiError extends Error {
  status?: number;
  response?: any;
}

// Meeting search parameters for the /meetings endpoint
export interface GetMeetingsParams {
  // Filter parameters
  mode?: string;
  data_source?: string;
  day?: number; // 0-6 (Sunday to Saturday)
  time?: string;
  region?: string | number;
  district?: string | number;
  type?: string | string[]; // Meeting type codes (e.g., 'O', 'C', 'ONL')
  query?: string; // Text search
  group_id?: number;
  location_id?: number;
  
  // Geolocation parameters
  latitude?: number;
  longitude?: number;
  distance?: number;
  distance_units?: 'mi' | 'km';
  
  // Attendance option
  attendance_option?: 'in_person' | 'online' | 'hybrid';
  
  // Post status
  post_status?: string | string[];
  
  // Authentication (if API is not open)
  nonce?: string;
  key?: string;
}

// Typeahead search parameters
export interface TypeaheadParams {
  nonce?: string;
}

// Geocode parameters
export interface GeocodeParams {
  address: string;
  nonce: string;
}

// Feedback parameters
export interface FeedbackParams {
  meeting_id: number;
  tsml_name: string;
  tsml_email: string;
  tsml_message: string;
  tsml_nonce: string;
}

// Meeting response object
export interface Meeting {
  id: number;
  name: string;
  slug: string;
  notes?: string;
  updated: string;
  location_id?: number;
  url: string;
  edit_url?: string;
  day?: number;
  time?: string;
  end_time?: string;
  time_formatted?: string;
  types?: string[];
  conference_url?: string;
  conference_url_notes?: string;
  conference_phone?: string;
  conference_phone_notes?: string;
  author?: string;
  
  // Location fields
  location?: string;
  location_notes?: string;
  location_url?: string;
  formatted_address?: string;
  approximate?: 'yes' | 'no';
  latitude?: number;
  longitude?: number;
  timezone?: string;
  region?: string;
  region_id?: number;
  sub_region?: string;
  regions?: string[];
  
  // Group fields
  group_id?: number;
  group?: string;
  group_notes?: string;
  district?: string;
  district_id?: number;
  sub_district?: string;
  website?: string;
  website_2?: string;
  email?: string;
  phone?: string;
  mailing_address?: string;
  venmo?: string;
  square?: string;
  paypal?: string;
  homegroup_online?: string;
  contact_1_name?: string;
  contact_1_email?: string;
  contact_1_phone?: string;
  contact_2_name?: string;
  contact_2_email?: string;
  contact_2_phone?: string;
  contact_3_name?: string;
  contact_3_email?: string;
  contact_3_phone?: string;
  last_contact?: string;
  
  // Computed fields
  attendance_option?: 'in_person' | 'online' | 'hybrid';
  
  // Data source fields
  data_source?: string;
  data_source_name?: string;
  entity?: string;
  entity_email?: string;
  entity_phone?: string;
  entity_location?: string;
  entity_url?: string;
  feedback_emails?: string[];
  feedback_url?: string;
}

// Typeahead result
export interface TypeaheadResult {
  value: string;
  type: 'region' | 'location' | 'group';
  tokens: string[];
  url?: string;
  id?: string;
}

// Geocode result
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  status?: string;
}

// Response types
export type GetMeetingsResponse = Meeting[];
export type TypeaheadResponse = TypeaheadResult[];
export type GeocodeResponse = GeocodeResult;
export type FeedbackResponse = string;

// Available TSML endpoints
export const TSML_ENDPOINTS = [
  {
    action: 'meetings',
    description: 'Search and retrieve meetings',
    requiresAuth: false, // Can be open, depends on site configuration
  },
  {
    action: 'tsml_typeahead',
    description: 'Get typeahead suggestions for search',
    requiresAuth: false,
  },
  {
    action: 'tsml_geocode',
    description: 'Geocode an address',
    requiresAuth: true,
  },
  {
    action: 'tsml_feedback',
    description: 'Submit feedback about a meeting',
    requiresAuth: true,
  },
] as const;
