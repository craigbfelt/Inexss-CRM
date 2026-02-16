export default function Input({ 
  label, 
  error, 
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full rounded-xl
          bg-white/60 backdrop-blur-sm
          border border-gray-300
          px-4 py-2.5
          text-gray-900 placeholder:text-gray-400
          shadow-apple-sm
          focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  children,
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          block w-full rounded-xl
          bg-white/60 backdrop-blur-sm
          border border-gray-300
          px-4 py-2.5
          text-gray-900
          shadow-apple-sm
          focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  error, 
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          block w-full rounded-xl
          bg-white/60 backdrop-blur-sm
          border border-gray-300
          px-4 py-2.5
          text-gray-900 placeholder:text-gray-400
          shadow-apple-sm
          focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
