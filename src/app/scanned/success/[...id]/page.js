// Server component wrapper for static export
// Using catch-all route [...id] to handle any scan ID with static export
import ScanSuccessClient from './ScanSuccessClient';

// Required for static export with dynamic routes
// Catch-all route will match any path under /scanned/success/
export async function generateStaticParams() {
  // Return empty array - catch-all route will handle all paths
  return [];
}

export default function ScanSuccessPage() {
  return <ScanSuccessClient />;
}

