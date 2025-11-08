import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TsmlApiClient } from './client.js';

export function createTsmlTools(_client: TsmlApiClient): Tool[] {
  return [
    // Search meetings tool
    {
      name: 'tsml_search_meetings',
      description: 'Search for 12-step recovery meetings with extensive filtering options. Supports filtering by day, time, type, location, region, and attendance option (in-person, online, hybrid). Includes geographic proximity search.',
      inputSchema: {
        type: 'object',
        properties: {
          day: {
            type: 'number',
            minimum: 0,
            maximum: 6,
            description: 'Day of week (0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday)'
          },
          time: {
            type: 'string',
            description: 'Filter by time (format: HH:MM in 24-hour format)'
          },
          type: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Meeting type code(s). Common types: O (Open), C (Closed), ONL (Online), B (Big Book), BEG (Beginners), W (Women), M (Men), Y (Young People), LGBTQ'
          },
          region: {
            oneOf: [
              { type: 'string' },
              { type: 'number' }
            ],
            description: 'Region name or term ID to filter meetings by geographic region'
          },
          district: {
            oneOf: [
              { type: 'string' },
              { type: 'number' }
            ],
            description: 'District name or term ID'
          },
          query: {
            type: 'string',
            description: 'Text search query - searches meeting names, locations, and group names'
          },
          group_id: {
            type: 'number',
            description: 'Filter by specific group ID'
          },
          location_id: {
            type: 'number',
            description: 'Filter by specific location ID'
          },
          latitude: {
            type: 'number',
            description: 'Latitude for geographic proximity search (must be used with longitude)'
          },
          longitude: {
            type: 'number',
            description: 'Longitude for geographic proximity search (must be used with latitude)'
          },
          distance: {
            type: 'number',
            description: 'Search radius for proximity search (default: 2). Use with latitude/longitude.'
          },
          distance_units: {
            type: 'string',
            enum: ['mi', 'km'],
            description: 'Distance units: mi (miles) or km (kilometers)'
          },
          attendance_option: {
            type: 'string',
            enum: ['in_person', 'online', 'hybrid'],
            description: 'Filter by meeting attendance type'
          },
          mode: {
            type: 'string',
            description: 'Search mode (default: search)'
          },
          data_source: {
            type: 'string',
            description: 'Filter by data source URL (for imported meetings)'
          },
          post_status: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'WordPress post status (default: publish)'
          }
        }
      }
    },

    // Get typeahead suggestions tool
    {
      name: 'tsml_get_typeahead',
      description: 'Get autocomplete suggestions for meeting search. Returns regions, locations, and group names to help users find meetings.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },

    // Geocode address tool (requires authentication)
    {
      name: 'tsml_geocode_address',
      description: 'Convert an address string to geographic coordinates (latitude/longitude). Note: This endpoint requires authentication via nonce.',
      inputSchema: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Address to geocode (e.g., "123 Main St, New York, NY 10001")'
          },
          nonce: {
            type: 'string',
            description: 'WordPress nonce for authentication (required)'
          }
        },
        required: ['address', 'nonce']
      }
    },

    // Submit feedback tool (requires authentication)
    {
      name: 'tsml_submit_feedback',
      description: 'Submit feedback or corrections about a meeting. Note: This endpoint requires authentication via nonce.',
      inputSchema: {
        type: 'object',
        properties: {
          meeting_id: {
            type: 'number',
            description: 'ID of the meeting to provide feedback about'
          },
          tsml_name: {
            type: 'string',
            description: 'Name of person submitting feedback'
          },
          tsml_email: {
            type: 'string',
            description: 'Email address of person submitting feedback'
          },
          tsml_message: {
            type: 'string',
            description: 'Feedback message or correction details'
          },
          tsml_nonce: {
            type: 'string',
            description: 'WordPress nonce for authentication (required)'
          }
        },
        required: ['meeting_id', 'tsml_name', 'tsml_email', 'tsml_message', 'tsml_nonce']
      }
    }
  ];
}

export async function handleToolCall(
  client: TsmlApiClient,
  name: string,
  args: Record<string, any>
): Promise<any> {
  switch (name) {
    case 'tsml_search_meetings':
      return await client.getMeetings(args);

    case 'tsml_get_typeahead':
      return await client.getTypeahead(args);

    case 'tsml_geocode_address':
      if (!args.address || !args.nonce) {
        throw new Error('Address and nonce are required for geocoding');
      }
      return await client.geocode({
        address: args.address,
        nonce: args.nonce,
      });

    case 'tsml_submit_feedback':
      if (!args.meeting_id || !args.tsml_name || !args.tsml_email || !args.tsml_message || !args.tsml_nonce) {
        throw new Error('All feedback fields are required: meeting_id, tsml_name, tsml_email, tsml_message, tsml_nonce');
      }
      return await client.submitFeedback({
        meeting_id: args.meeting_id,
        tsml_name: args.tsml_name,
        tsml_email: args.tsml_email,
        tsml_message: args.tsml_message,
        tsml_nonce: args.tsml_nonce,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
