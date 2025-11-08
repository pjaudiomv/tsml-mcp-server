# TSML MCP Server

A Model Context Protocol (MCP) server that provides access to the 12 Step Meeting List (TSML) WordPress plugin API. Enables AI assistants like Claude to search and access recovery meeting data from WordPress sites running the TSML plugin.

## 🚀 Overview

This MCP server exposes the TSML WordPress plugin API endpoints as tools, allowing AI assistants to query meeting data for Alcoholics Anonymous, Narcotics Anonymous, Al-Anon, and other 12-step recovery programs. Perfect for building recovery-focused applications and AI assistants.

## ✨ Features

- **🔍 Meeting Search**: Extensive filtering by day, time, type, location, and attendance option
- **📍 Geographic Search**: Proximity-based meeting discovery using latitude/longitude
- **🏷️ Type Filtering**: Filter by meeting types (Open, Closed, Online, etc.)
- **🌍 Region/District Support**: Hierarchical geographic organization
- **💬 Typeahead Suggestions**: Autocomplete for regions, locations, and groups
- **🔒 Type Safety**: Full TypeScript implementation
- **🛡️ Error Handling**: Robust error handling with meaningful messages
- **⚙️ Flexible Configuration**: Environment variable configuration
- **🔑 Authentication Support**: Optional API key authentication

## Available Tools

### 1. `tsml_search_meetings`
Search for recovery meetings with extensive filtering options.

**Parameters:**
- `day`: Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
- `time`: Filter by meeting time (HH:MM format)
- `type`: Meeting type codes (e.g., 'O', 'C', 'ONL', 'B', 'BEG')
- `region`: Region name or term ID
- `district`: District name or term ID
- `query`: Text search across meeting names, locations, and groups
- `group_id`: Specific group ID
- `location_id`: Specific location ID
- `latitude`, `longitude`: Geographic coordinates for proximity search
- `distance`: Search radius (default: 2)
- `distance_units`: 'mi' (miles) or 'km' (kilometers)
- `attendance_option`: 'in_person', 'online', or 'hybrid'
- `mode`: Search mode
- `data_source`: Filter by data source URL
- `post_status`: WordPress post status

**Common Meeting Types:**
- `O` - Open (to anyone)
- `C` - Closed (members only)
- `ONL` - Online meeting
- `B` - Big Book study
- `BEG` - Beginners meeting
- `W` - Women only
- `M` - Men only
- `Y` - Young people
- `LGBTQ` - LGBTQ+ focused

### 2. `tsml_get_typeahead`
Get autocomplete suggestions for meeting search.

Returns regions, locations, and group names to help users find meetings.

### 3. `tsml_geocode_address`
Convert an address string to geographic coordinates.

**Parameters:**
- `address`: Address to geocode (required)
- `nonce`: WordPress nonce for authentication (required)

**Note**: Requires authentication via nonce.

### 4. `tsml_submit_feedback`
Submit feedback or corrections about a meeting.

**Parameters:**
- `meeting_id`: ID of the meeting (required)
- `tsml_name`: Submitter name (required)
- `tsml_email`: Submitter email (required)
- `tsml_message`: Feedback message (required)
- `tsml_nonce`: WordPress nonce (required)

**Note**: Requires authentication via nonce.

## 📦 Installation

### Prerequisites

- Node.js 20.0.0 or later
- npm or yarn
- WordPress site with 12 Step Meeting List plugin installed

### Install from npm

```bash
# Install globally
npm install -g tsml-mcp-server

# Or install locally in your project
npm install tsml-mcp-server
```

### Install from source

```bash
git clone https://github.com/pjaudiomv/tsml-mcp-server.git
cd tsml-mcp-server
npm install
npm run build
npm install -g .
```

## Configuration

### Environment Variables

- `TSML_WORDPRESS_URL` (required): The base URL of your WordPress site
- `TSML_API_KEY` (optional): API key if the site requires authentication
- `TSML_TIMEOUT`: Request timeout in milliseconds (default: 30000)
- `TSML_USER_AGENT`: Custom user agent string

### Example Configuration

```bash
export TSML_WORDPRESS_URL=https://example.org
export TSML_API_KEY=your-api-key-here
export TSML_TIMEOUT=60000
export TSML_USER_AGENT=MyApp-TSML-MCP/1.0.0
```

## Usage

### Running the Server

```bash
# Using environment variables
TSML_WORDPRESS_URL=https://example.org tsml-mcp-server

# Or if installed from source
TSML_WORDPRESS_URL=https://example.org node dist/index.js
```

### Using with Claude Desktop

Add this to your Claude Desktop configuration file:

**Mac/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tsml": {
      "command": "tsml-mcp-server",
      "env": {
        "TSML_WORDPRESS_URL": "https://your-site.org"
      }
    }
  }
}
```

**Development Example:**

```json
{
  "mcpServers": {
    "tsml-mcp-server": {
      "command": "node",
      "args": ["/PATH_TO_REPO/tsml-mcp-server/dist/index.js"],
      "env": {
        "TSML_WORDPRESS_URL": "https://your-site.org",
        "TSML_API_KEY": "optional-api-key"
      }
    }
  }
}
```

### Using with other MCP clients

The server follows the standard MCP protocol and can be used with any MCP-compatible client.

## Examples

### Search for Meetings on Tuesday

```typescript
{
  "name": "tsml_search_meetings",
  "arguments": {
    "day": 2
  }
}
```

### Search for Online Meetings

```typescript
{
  "name": "tsml_search_meetings",
  "arguments": {
    "attendance_option": "online"
  }
}
```

### Search Near Geographic Location

```typescript
{
  "name": "tsml_search_meetings",
  "arguments": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "distance": 5,
    "distance_units": "mi"
  }
}
```

### Search for Beginners Meetings

```typescript
{
  "name": "tsml_search_meetings",
  "arguments": {
    "type": "BEG",
    "day": 2
  }
}
```

### Text Search

```typescript
{
  "name": "tsml_search_meetings",
  "arguments": {
    "query": "step study"
  }
}
```

### Get Typeahead Suggestions

```typescript
{
  "name": "tsml_get_typeahead",
  "arguments": {}
}
```

## Development

### Setup

```bash
git clone https://github.com/pjaudiomv/tsml-mcp-server.git
cd tsml-mcp-server
npm install
```

### Available Scripts

- `npm run dev`: Run in development mode with hot reload
- `npm run build`: Build for production
- `npm run watch`: Build and watch for changes
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues

### Project Structure

```
src/
├── index.ts          # Main server implementation
├── client.ts         # TSML API client
├── tools.ts          # MCP tool definitions and handlers
└── types.ts          # TypeScript type definitions
```

## API Reference

### TSML WordPress Plugin API

This server implements the public AJAX endpoints from the 12 Step Meeting List WordPress plugin:

- **meetings**: Meeting search with extensive filtering
- **tsml_typeahead**: Autocomplete suggestions
- **tsml_geocode**: Address geocoding (requires auth)
- **tsml_feedback**: Meeting feedback submission (requires auth)

### Response Format

All meeting responses include:
- Meeting details (name, day, time, types, notes)
- Location information (address, coordinates, timezone)
- Group information (if applicable)
- Contact information (if public)
- Attendance options (in_person, online, hybrid)

### Attendance Options

Meetings are automatically categorized by attendance type:
- **in_person**: Traditional physical meetings
- **online**: Virtual meetings only
- **hybrid**: Both in-person and online participation available

### Sorting

Meetings are automatically sorted by:
1. Day of week (Sunday-Saturday)
2. Meeting time
3. Location name
4. Meeting name

## Error Handling

The server provides comprehensive error handling:

- Missing required environment variables
- HTTP request failures
- API-specific errors
- Network timeouts and connectivity issues
- Authentication failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and ensure builds pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: Report bugs and request features on GitHub
- **Plugin Documentation**: https://wordpress.org/plugins/12-step-meeting-list/
- **Community**: Code for Recovery community

## Related Projects

- [12 Step Meeting List Plugin](https://github.com/code4recovery/12-step-meeting-list)
- [TSML UI](https://github.com/code4recovery/tsml-ui)
- [Model Context Protocol](https://modelcontextprotocol.io)

## Changelog

### v1.0.0
- Initial release
- Complete TSML API coverage
- TypeScript implementation
- Comprehensive error handling
- Full parameter validation
