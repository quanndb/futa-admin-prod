export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-8 border-solid rounded-full relative">
        <div className="absolute inset-0 w-full h-full border-t-8 border-orange-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
