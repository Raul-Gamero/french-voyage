export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

