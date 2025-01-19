export default function SkeletonLoader() {
    return (
      <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative aspect-square bg-gray-200"></div>
        <div className="p-4 sm:p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }