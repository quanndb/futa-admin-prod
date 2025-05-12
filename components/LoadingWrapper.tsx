// components/common/LoadingWrapper.client.tsx
"use client";
import { useLoading } from "@/store/LoadingStore";

// Ensures that this component is only rendered on the client-side

const LoadingIndicator = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-8 border-solid rounded-full relative">
        <div className="absolute inset-0 w-full h-full border-t-8 border-orange-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default function LoadingWrapper() {
  const { isLoading } = useLoading();

  return isLoading ? <LoadingIndicator /> : null;
}
