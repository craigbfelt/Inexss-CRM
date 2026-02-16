import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  gradient = false,
  hover = true,
  ...props 
}) {
  const baseClasses = `
    rounded-2xl p-6 
    ${gradient 
      ? 'bg-gradient-to-br from-white/80 to-white/40' 
      : 'bg-white/60'
    }
    backdrop-blur-xl
    border border-gray-200/50
    shadow-apple
    ${hover ? 'transition-all duration-300 hover:shadow-apple-lg hover:-translate-y-1' : ''}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
