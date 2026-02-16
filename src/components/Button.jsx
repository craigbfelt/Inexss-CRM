import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-apple-blue to-apple-indigo text-white shadow-apple hover:shadow-apple-lg disabled:from-gray-400 disabled:to-gray-500',
    secondary: 'bg-white/60 text-gray-900 border border-gray-200 shadow-apple-sm hover:bg-white/80 hover:shadow-apple disabled:bg-gray-100',
    outline: 'bg-transparent border-2 border-apple-blue text-apple-blue hover:bg-apple-blue/10 disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100/50 disabled:text-gray-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-apple hover:shadow-apple-lg disabled:from-gray-400 disabled:to-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        rounded-xl font-semibold
        transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
