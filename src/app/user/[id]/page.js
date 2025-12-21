// Server component for static export compatibility
// Static export requires generateStaticParams() to be in a server component
import UserScanClient from './UserScanClient';

// Required for static export - returns a placeholder route for build-time generation
// Client-side code handles all actual user IDs dynamically by extracting from URL
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function UserScanPage({ params }) {
  // Pass params to client component, but UserScanClient will extract the real ID from URL
  // This works with static export since we can't know all user IDs at build time
  return <UserScanClient params={params} />;
}
