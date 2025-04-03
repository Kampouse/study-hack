import type { QwikIntrinsicElements, Component } from "@builder.io/qwik";

// --- Reusable Types ---

// Type for the raw user data structure expected from the backend/layout query
export type RawUserDataType = {
  ID: number;
  Name: string | null; // Allow null from backend
  Description: string | null; // Used for both username fallback and bio
  Intrests: string | string[] | null; // Handle potential typo and types
  Image: string | null; // Avatar URL
  JoinedDate: string | null; // ISO Date string or similar
  Connections: number | null; // Number of connections
  // Add other potential fields if known from the backend response
  // Example: Username?: string | null;
};

// Type for active requests displayed in the sidebar
export type ActiveRequestType = {
  requestId: number | null; // Allow string if IDs aren't always numbers
  eventName?: string | null;
  username?: string | null;
  image?: string | null;
  // Add other relevant request fields if available, e.g., eventId, requestStatus
};

// Type for the data structure returned by useQueries (defined in layout.tsx presumably)
// Ensure this matches the actual return type of useQueries
export type QueriesDataType = {
  userData: RawUserDataType | null;
  activeRequest: ActiveRequestType[] | null;
  // Add other potential data points returned by useQueries
};

// User profile structure used for display within this component
export type UserProfileType = {
  name: string;
  username: string; // Derived or mapped from backend data
  bio: string;
  avatar?: string;
  skills: string[]; // Derived/mapped from backend 'Intrests'
  joinedDate: string; // Formatted date string
};

// Define expected structure for raw event data from API
// TODO: Adjust based on the actual API response from getAllReferenceEvents
// This might be slightly different from DetailedEventType used for display
export interface RawEventType {
  id: number;
  eventID?: number;
  name: string;
  description?: string | null;
  date: string;
  time?: string;
  location?: string | null;
  image?: string | null;
  attendees?: number | string | null; // API might return number or string
  status?: "Host" | "Confirmed" | "Pending" | string; // Allow known statuses + general string
  role?: "Host" | "Attendee" | string; // User's role
  placeId?: number | null;
  userID?: number; // Host user ID
  background?: string | null;
  experience?: string | null;
  whyJoin?: string | null;
  createdAt?: string | null;
  // If 'requests' exists in raw data and indicates pending status, keep it, but maybe typed
  requests?: ActiveRequestType[] | null; // Be specific if structure is known, e.g., RequestSummaryType[]
}

// More detailed Event Type for consistent use in UI components
// This might differ slightly from RawEventType if transformations are applied
export type DetailedEventType = {
  id: number; // Unique identifier (use eventID or id)
  eventID?: number; // Original eventID if available
  name: string;
  description?: string | null;
  date: string; // ISO string format preferred
  time?: string; // Often derived from date
  location?: string | null;
  image?: string | null;
  attendees?: number | null; // Ensure this is a number after processing
  status?: "Host" | "Confirmed" | "Pending" | string; // Display status
  role?: "Host" | "Attendee" | string; // User's role in the event
  placeId?: number | null;
  userID?: number; // Host user ID
  // Add other fields derived or directly mapped from RawEventType if needed for display
};

// Define expected structure for raw place data from API
// TODO: Adjust based on the actual API response from apiGetSavedPlaces
export interface RawPlaceType {
  id: number;
  placeId?: number;
  name: string;
  location: string;
  description: string;
  tags: string[];
  rating: number | string; // API might return number or string
  image?: string | null;
  visitCount: number | string; // API might return number or string
}

// Type for Place data used within UI components
export type PlaceType = {
  id: number; // Unique identifier (use placeId or id)
  placeId?: number; // Original placeId if available
  name: string;
  location: string;
  description: string;
  tags: string[];
  rating: number; // Ensure this is a number
  image?: string | null;
  visitCount: number; // Ensure this is a number
};

// Type for the stats displayed below the profile header
export type StatsType = {
  upcomingEvents: number;
  hostedEvents: number;
  savedPlaces: number;
  connections: number;
};

// Define props for Lucide icon components passed as props
export type IconProps = QwikIntrinsicElements["svg"] & {
  class?: string;
  size?: number | string;
};
// Type alias for the Qwik component type representing an icon
export type IconComponent = Component<IconProps>;

// Define the expected structure for the profile update data
// TODO: Refine this based on the actual updateProfileForm requirements
export interface ProfileUpdateData {
  name: string;
  about: string;
  interests: string[]; // Assuming interests are passed as an array of strings
  // Add other fields as required by the backend API
}

// Define a more specific return type for the action result
export interface UpdateUserResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>; // Assuming field errors map field names to arrays of error messages
  data?: unknown; // Optional: Add type for returned data on success if any
}
