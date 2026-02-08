"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";

export default function LinkedInCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { oauthLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const state = searchParams.get("state");

      if (error) {
        // Handle error
        console.error("LinkedIn OAuth error:", error);
        router.push("/login?error=linkedin_auth_failed");
        return;
      }

      if (!code) {
        router.push("/login?error=no_code");
        return;
      }

      // Verify state
      const savedState = sessionStorage.getItem("linkedin_oauth_state");
      if (state !== savedState) {
        router.push("/login?error=invalid_state");
        return;
      }

      // Clear state
      sessionStorage.removeItem("linkedin_oauth_state");

      try {
        // Exchange code for access token via backend
        // Note: This requires backend endpoint to exchange code for token
        // For now, we'll redirect to login with error message
        // You'll need to implement backend endpoint: POST /api/users/oauth/linkedin/exchange
        
        // Temporary: Show message that LinkedIn OAuth needs backend implementation
        router.push("/login?error=linkedin_not_implemented");
      } catch (err) {
        console.error("LinkedIn callback error:", err);
        router.push("/login?error=linkedin_callback_failed");
      }
    };

    handleCallback();
  }, [searchParams, router, oauthLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing LinkedIn authentication...</p>
      </div>
    </div>
  );
}

