// Server component wrapper for static export
import ScanSuccessClient from './ScanSuccessClient';

// Required for static export with dynamic routes
// With static export, we need to provide at least one parameter
// This creates a placeholder route that will handle all dynamic IDs at runtime
export async function generateStaticParams() {
  // Return a placeholder ID for static export
  // The actual routing will be handled client-side
  return [{ id: 'placeholder' }];
}

export default function ScanSuccessPage() {
  return <ScanSuccessClient />;
}
