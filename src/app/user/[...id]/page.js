// Server component for static export compatibility
// Using catch-all route [...id] to handle any user ID with static export
import UserScanClient from './UserScanClient';

// Required for static export - returns empty array to allow any dynamic params
// Catch-all route will match any path under /user/
export function generateStaticParams() {
  // Return empty array - catch-all route will handle all paths
  return [];
}

export default function UserScanPage({ params }) {
  // Catch-all route: params.id will be an array
  // Pass params to client component, which will extract the actual user ID
  return <UserScanClient params={params} />;
}

