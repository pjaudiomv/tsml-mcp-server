# 12 Step Meeting List API Documentation

## Overview

The 12 Step Meeting List plugin provides several AJAX endpoints for accessing meeting data. The primary endpoint for fetching meeting data is the `/meetings` endpoint, which supports various filtering and querying options.

## Authentication

The API supports three authentication methods:

1. **Open Sharing** - If `tsml_sharing` is set to `'open'`, no authentication is required
2. **Nonce-based** - Include a valid WordPress nonce in the `nonce` parameter
3. **API Key** - Include a valid API key in the `key` parameter (keys managed via `tsml_sharing_keys` option)

## Base URL

All AJAX endpoints are accessed via:
```
https://your-site.com/wp-admin/admin-ajax.php
```

---

## Primary Endpoint: Get Meetings

### Endpoint
```
GET/POST /wp-admin/admin-ajax.php?action=meetings
```

### Description
Retrieve meeting data with optional filtering. Returns a JSON array of meetings with location, group, and contact information.

### Authentication
- **Open**: No authentication required if sharing is open
- **Nonce**: `?action=meetings&nonce=YOUR_NONCE`
- **API Key**: `?action=meetings&key=YOUR_API_KEY`

### Headers
- **CORS**: `Access-Control-Allow-Origin: *` (enabled by default)

### Query Parameters

All parameters are optional and used for filtering:

| Parameter | Type | Description |
|-----------|------|-------------|
| `mode` | string | Search mode (default: `search`) |
| `data_source` | string | Filter by data source URL |
| `day` | integer | Day of week (0=Sunday, 6=Saturday) |
| `time` | string | Filter by time (format: `HH:MM` or time-based filter) |
| `region` | string/integer | Region name or term ID |
| `district` | string/integer | District name or term ID |
| `type` | string/array | Meeting type code(s) (e.g., `O`, `C`, `ONL`) |
| `query` | string | Text search query (searches meeting names, locations, groups) |
| `group_id` | integer | Filter by specific group ID |
| `location_id` | integer | Filter by specific location ID |
| `latitude` | float | Latitude for proximity search |
| `longitude` | float | Longitude for proximity search |
| `distance` | float | Search radius (default: 2) |
| `distance_units` | string | `mi` (miles) or `km` (kilometers) |
| `attendance_option` | string | Filter by attendance type: `in_person`, `online`, or `hybrid` |
| `post_status` | string/array | WordPress post status (default: `publish`) |

### Response Format

Returns a JSON array of meeting objects. Each meeting includes:

#### Meeting Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Meeting post ID |
| `name` | string | Meeting name |
| `slug` | string | URL-friendly slug |
| `notes` | string | Meeting notes/description |
| `updated` | string | Last updated timestamp (GMT) |
| `url` | string | Permalink to meeting page |
| `edit_url` | string | Admin edit URL |
| `day` | integer | Day of week (0-6) |
| `time` | string | Meeting time (24-hour format: `HH:MM`) |
| `end_time` | string | Meeting end time (24-hour format: `HH:MM`) |
| `time_formatted` | string | Formatted time string |
| `types` | array | Array of meeting type codes |
| `conference_url` | string | Online meeting URL |
| `conference_url_notes` | string | Notes about online meeting |
| `conference_phone` | string | Conference phone number |
| `conference_phone_notes` | string | Notes about conference phone |
| `author` | string | WordPress user login who created meeting |

#### Location Fields (merged into meeting object)
| Field | Type | Description |
|-------|------|-------------|
| `location_id` | integer | Location post ID |
| `location` | string | Location name |
| `location_notes` | string | Additional location information |
| `location_url` | string | Permalink to location page |
| `formatted_address` | string | Full formatted address |
| `approximate` | string | `yes` if address is approximate, `no` otherwise |
| `latitude` | float | Geographic latitude |
| `longitude` | float | Geographic longitude |
| `timezone` | string | IANA timezone identifier |
| `region` | string | Region name |
| `region_id` | integer | Region term ID |
| `sub_region` | string | Sub-region name (if hierarchical) |
| `regions` | array | Array of region hierarchy (e.g., `["Midwest", "Illinois", "Chicago"]`) |

#### Group Fields (merged into meeting object if meeting belongs to group)
| Field | Type | Description |
|-------|------|-------------|
| `group_id` | integer | Group post ID |
| `group` | string | Group name |
| `group_notes` | string | Group description/notes |
| `district` | string | District name |
| `district_id` | integer | District term ID |
| `sub_district` | string | Sub-district name (if hierarchical) |
| `website` | string | Group website URL |
| `website_2` | string | Secondary website URL |
| `email` | string | Group email |
| `phone` | string | Group phone number |
| `mailing_address` | string | Group mailing address |
| `venmo` | string | Venmo handle for donations |
| `square` | string | Square payment link |
| `paypal` | string | PayPal payment link |
| `homegroup_online` | string | Online homegroup identifier |
| `contact_1_name` | string | Primary contact name |
| `contact_1_email` | string | Primary contact email |
| `contact_1_phone` | string | Primary contact phone |
| `contact_2_name` | string | Secondary contact name |
| `contact_2_email` | string | Secondary contact email |
| `contact_2_phone` | string | Secondary contact phone |
| `contact_3_name` | string | Tertiary contact name |
| `contact_3_email` | string | Tertiary contact email |
| `contact_3_phone` | string | Tertiary contact phone |
| `last_contact` | string | Date of last contact |

**Note**: Contact fields are only included if `tsml_contact_display` is set to `'public'` or when authenticated for full export.

#### Computed Fields
| Field | Type | Description |
|-------|------|-------------|
| `attendance_option` | string | Calculated from types: `in_person`, `online`, or `hybrid` |

#### Import/Data Source Fields
| Field | Type | Description |
|-------|------|-------------|
| `data_source` | string | Source URL if meeting is imported |
| `data_source_name` | string | Human-readable data source name |
| `entity` | string | Entity name managing the meeting |
| `entity_email` | string | Entity contact email |
| `entity_phone` | string | Entity contact phone |
| `entity_location` | string | Entity location |
| `entity_url` | string | Entity website URL |
| `feedback_emails` | array | Email addresses for feedback |
| `feedback_url` | string | URL for submitting feedback |

### Example Request

```bash
# Get all meetings
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings"

# Get meetings on Tuesday (day=2)
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&day=2"

# Get online meetings (type=ONL)
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&type=ONL"

# Get meetings near coordinates within 5 miles
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&latitude=40.7128&longitude=-74.0060&distance=5"

# Get meetings by region
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&region=Manhattan"

# Search query
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&query=beginners"

# Multiple filters
curl "https://your-site.com/wp-admin/admin-ajax.php?action=meetings&day=2&type=O&attendance_option=in_person"
```

### Example Response

```json
[
  {
    "id": 123,
    "name": "Tuesday Night Beginners",
    "slug": "tuesday-night-beginners",
    "notes": "Open meeting focused on step work",
    "updated": "2025-01-15 10:30:00",
    "location_id": 45,
    "url": "https://your-site.com/meetings/tuesday-night-beginners/",
    "edit_url": "https://your-site.com/wp-admin/post.php?post=123&action=edit",
    "day": 2,
    "time": "19:00",
    "end_time": "20:00",
    "time_formatted": "7:00 pm",
    "types": ["O", "B", "BEG"],
    "location": "Community Church",
    "location_notes": "Enter through side door",
    "location_url": "https://your-site.com/locations/community-church/",
    "formatted_address": "123 Main St, New York, NY 10001",
    "approximate": "no",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York",
    "region": "Manhattan",
    "region_id": 5,
    "regions": ["New York", "Manhattan", "Midtown"],
    "group": "Midtown Group",
    "group_id": 67,
    "district": "District 15",
    "district_id": 8,
    "website": "https://midtowngroup.org",
    "email": "info@midtowngroup.org",
    "phone": "212-555-0100",
    "attendance_option": "in_person",
    "author": "admin"
  }
]
```

---

## Supporting Endpoints

### Typeahead Search

```
GET/POST /wp-admin/admin-ajax.php?action=tsml_typeahead
```

Returns regions, locations, and groups for autocomplete functionality.

**Authentication**: Public (no authentication required)

**Response**: Array of objects with `value`, `type`, `tokens`, and optional `url` or `id`

**Example**:
```json
[
  {
    "value": "Community Church",
    "type": "location",
    "tokens": ["community", "church"],
    "url": "https://your-site.com/locations/community-church/"
  },
  {
    "value": "Manhattan",
    "type": "region",
    "tokens": ["manhattan"],
    "id": "manhattan"
  }
]
```

---

### Geocoding

```
GET /wp-admin/admin-ajax.php?action=tsml_geocode&address=ADDRESS&nonce=NONCE
```

Geocode an address to coordinates.

**Authentication**: Requires nonce

**Parameters**:
- `address` (string, required): Address to geocode
- `nonce` (string, required): WordPress nonce

**Response**: Geocoding result object with `latitude`, `longitude`, `formatted_address`

---

### Feedback Submission

```
POST /wp-admin/admin-ajax.php?action=tsml_feedback
```

Submit user feedback about a meeting.

**Authentication**: Public (with nonce validation)

**Parameters**:
- `meeting_id` (integer, required): Meeting ID
- `tsml_name` (string, required): Submitter name
- `tsml_email` (string, required): Submitter email
- `tsml_message` (string, required): Feedback message
- `tsml_nonce` (string, required): WordPress nonce

**Response**: Success or error message text

---

## CSV Export (Admin Only)

```
GET /wp-admin/admin-ajax.php?action=csv
```

Export all meetings as CSV file.

**Authentication**: Requires meetings management permission

**Response**: CSV file download with all meeting data

---

## Meeting Types

Meeting types vary by program (AA, NA, Al-Anon, etc.). Common types include:

| Code | Description |
|------|-------------|
| `O` | Open (to anyone) |
| `C` | Closed (members only) |
| `ONL` | Online meeting |
| `TC` | Temporarily closed (in-person location) |
| `B` | Big Book study |
| `BEG` | Beginners meeting |
| `W` | Women only |
| `M` | Men only |
| `Y` | Young people |
| `LGBTQ` | LGBTQ+ focused |

The available types are program-specific and stored in the `$tsml_programs` global variable.

---

## Attendance Options

The `attendance_option` field (and filter parameter) is computed based on meeting types:

- **`in_person`**: Meeting has physical location and is not marked as online-only
- **`online`**: Meeting has `ONL` type (online meeting)
- **`hybrid`**: Meeting has both online (`ONL`) and in-person components

---

## Sorting

Meetings are automatically sorted by:
1. Custom sort field (if `$tsml_sort_by` is set)
2. Day of week (respecting WordPress `start_of_week` setting)
3. Time
4. Location name
5. Meeting name

---

## Rate Limiting & Caching

- Meeting data is cached to a JSON file (path stored in `tsml_cache` option)
- Cache is rebuilt automatically when meetings are saved/deleted
- No built-in rate limiting on public endpoints

---

## Error Responses

**401 Unauthorized**: Authentication failed
```json
{
  "error": "HTTP/1.1 401 Unauthorized"
}
```

**Empty Results**: Returns empty array
```json
[]
```

---

## Additional Notes

### Distance Search
- Requires both `latitude` and `longitude` parameters
- Optional `distance` parameter (defaults to 2)
- Distance units determined by `distance_units` parameter or site setting

### Timezone Handling
- All meeting times are stored in local time for the meeting location
- Timezone information is included in the `timezone` field

### Data Sources
- Meetings can be imported from external feeds
- Imported meetings include `data_source` and `data_source_name` fields
- Entity information differs between locally managed and imported meetings

### Custom Fields
- Plugin supports custom meeting fields via `$tsml_custom_meeting_fields`
- Custom fields are only exported in full CSV exports, not standard API responses
