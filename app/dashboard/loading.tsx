export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>

      <div className="flex justify-between mb-8">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

