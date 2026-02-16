export default function AccountSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-border space-y-3">
        <div className="h-5 w-28 bg-gray-200 rounded-md" />
        <div className="h-3 w-40 bg-gray-200 rounded-md" />
      </div>

      {/* LINKS */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded-md" />
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* FOOTER BUTTON */}
      <div className="p-6 border-t border-border">
        <div className="h-10 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
