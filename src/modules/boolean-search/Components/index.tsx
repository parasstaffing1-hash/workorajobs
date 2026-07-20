import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Template, Platform } from '../Types';

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: keyof typeof Lucide;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const IconComponent = icon ? Lucide[icon] as React.ComponentType<{ className?: string }> : null;

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500 border border-transparent',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 focus:ring-gray-400 border border-transparent',
    outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 focus:ring-gray-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 border border-transparent',
    accent: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 border border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2 w-9 h-9'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {IconComponent && iconPosition === 'left' && <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
      {IconComponent && iconPosition === 'right' && <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    </button>
  );
};

// ==========================================
// 2. CARD COMPONENTS
// ==========================================
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white font-display tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-5 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20 flex items-center justify-end gap-2 ${className}`} {...props}>
    {children}
  </div>
);

// ==========================================
// 3. INPUT COMPONENT
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: keyof typeof Lucide;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const IconComponent = icon ? Lucide[icon] as React.ComponentType<{ className?: string }> : null;
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full text-sm rounded-lg border bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            ${IconComponent ? 'pl-9' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-800'}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-gray-400">{helperText}</span>}
    </div>
  );
};

// ==========================================
// 4. SEARCH BAR COMPONENT
// ==========================================
interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  value: string;
}

export const Search: React.FC<SearchProps> = ({ value, onClear, className = '', ...props }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        <Lucide.Search className="w-4.5 h-4.5" />
      </div>
      <input
        type="text"
        value={value}
        className="w-full text-sm py-2.5 pl-10 pr-9 border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
        >
          <Lucide.X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// 5. DROPDOWN COMPONENT
// ==========================================
interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  icon?: keyof typeof Lucide;
  helperText?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  icon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const IconComponent = icon ? Lucide[icon] as React.ComponentType<{ className?: string }> : null;
  const dropdownId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={dropdownId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <select
          id={dropdownId}
          className={`w-full text-sm py-2 pl-3 pr-8 rounded-lg border bg-white dark:bg-gray-950 text-gray-900 dark:text-white border-gray-300 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none cursor-pointer
            ${IconComponent ? 'pl-9' : ''}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <Lucide.ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {helperText && <span className="text-xs text-gray-400">{helperText}</span>}
    </div>
  );
};

// ==========================================
// 6. BADGE COMPONENT
// ==========================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'gray' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'cyan' | 'indigo' | 'success' | 'danger' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50',
    gray: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700/60',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
    red: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50',
    danger: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50',
    yellow: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30',
    warning: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30',
    purple: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50',
    orange: 'bg-orange-50 text-orange-800 border-orange-100 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/30',
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-100 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[variant] || colorMap.gray} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// 7. TAG COMPONENT
// ==========================================
interface TagProps {
  children: string;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export const Tag: React.FC<TagProps> = ({ children, onRemove, onClick, className = '', active = false }) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all duration-200
        ${active 
          ? 'bg-indigo-600 border-transparent text-white shadow-sm' 
          : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-850'
        }
        ${className}
      `}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors cursor-pointer"
        >
          <Lucide.X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// ==========================================
// 8. OPERATOR CHIP
// ==========================================
interface OperatorChipProps {
  operator: string;
  onClick?: () => void;
  description?: string;
}

export const OperatorChip: React.FC<OperatorChipProps> = ({ operator, onClick, description }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start px-3.5 py-2 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500/70 rounded-xl bg-white dark:bg-gray-900 text-left transition-all duration-200 hover:shadow-sm cursor-pointer"
    >
      <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 group-hover:scale-102 transition-transform">
        {operator}
      </span>
      {description && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
          {description}
        </span>
      )}
    </button>
  );
};

// ==========================================
// 9. STATISTIC CARD COMPONENT
// ==========================================
interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Lucide;
  change?: {
    value: string;
    positive: boolean;
  };
  onClick?: () => void;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  change,
  onClick
}) => {
  const IconComponent = Lucide[icon] as React.ComponentType<{ className?: string }>;

  return (
    <Card 
      className={`relative p-5 flex flex-col justify-between cursor-pointer group ${onClick ? 'hover:border-indigo-400 dark:hover:border-indigo-900' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-bold font-display text-gray-900 dark:text-white">
          {value}
        </span>
        {change && (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full
            ${change.positive 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300' 
              : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300'
            }
          `}>
            {change.positive ? '+' : ''}{change.value}
          </span>
        )}
      </div>
    </Card>
  );
};

// ==========================================
// 10. SIDEBAR ITEM COMPONENT
// ==========================================
interface SidebarItemProps {
  title: string;
  icon: keyof typeof Lucide;
  active: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  icon,
  active,
  onClick
}) => {
  const IconComponent = Lucide[icon] as React.ComponentType<{ className?: string }>;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer text-left focus:outline-none
        ${active
          ? 'bg-indigo-600/10 text-indigo-400 font-bold border-l-2 border-indigo-500'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
        }
      `}
    >
      {IconComponent && <IconComponent className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />}
      <span className="truncate">{title}</span>
    </button>
  );
};

// ==========================================
// 11. PLATFORM CARD COMPONENT
// ==========================================
interface PlatformCardProps {
  platform: Platform;
  onClick: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onClick }) => {
  const IconComponent = (Lucide[platform.iconName as keyof typeof Lucide] || Lucide.Globe) as React.ComponentType<{ className?: string }>;

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex items-center gap-3.5 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-gray-950 dark:text-white font-display truncate">
          {platform.name}
        </h4>
        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
          {platform.description}
        </p>
      </div>
      <Lucide.ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors ml-auto shrink-0 group-hover:translate-x-1 duration-200" />
    </div>
  );
};

// ==========================================
// 12. BREADCRUMB COMPONENT
// ==========================================
interface BreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider py-1.5 overflow-x-auto whitespace-nowrap scrollbar-none" aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-1.5">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center gap-1.5">
            {index > 0 && <Lucide.ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-750" />}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-600 dark:text-gray-350">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ==========================================
// 13. TOAST NOTIFICATION WIDGET
// ==========================================
interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: 'CheckCircle2' as const, style: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-emerald-100/50 dark:shadow-none' },
    info: { icon: 'Info' as const, style: 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-200 shadow-indigo-100/50 dark:shadow-none' },
    warning: { icon: 'AlertTriangle' as const, style: 'bg-amber-50 dark:bg-amber-950 border-amber-250 dark:border-amber-900 text-amber-850 dark:text-amber-250 shadow-amber-100/50 dark:shadow-none' },
    error: { icon: 'XCircle' as const, style: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 shadow-red-100/50 dark:shadow-none' }
  };

  const IconComponent = Lucide[config[type].icon] as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4.5 py-3.5 border rounded-xl shadow-lg ${config[type].style}`}
    >
      <IconComponent className="w-5 h-5 shrink-0" />
      <span className="text-sm font-semibold pr-2">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors ml-auto cursor-pointer">
        <Lucide.X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ==========================================
// 14. MODAL POPUP
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  // Prevent backgrounds scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden`}
          >
            <div className="px-6 py-4.5 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
              <h3 className="text-base font-bold font-display text-gray-950 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Lucide.X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 leading-relaxed scrollbar-thin">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t border-gray-150 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/10 flex items-center justify-end gap-2 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 15. DRAWER SLIDE-OVER COMPONENT
// ==========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Sliding Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="w-screen max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col h-full"
            >
              <div className="px-5 py-4 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="text-sm font-bold font-display text-gray-950 dark:text-white uppercase tracking-wider">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <Lucide.X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 16. HORIZONTAL TABS
// ==========================================
interface TabsProps {
  tabs: { value: string; label: string; icon?: keyof typeof Lucide }[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto whitespace-nowrap scrollbar-none gap-2 ${className}`}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon ? Lucide[tab.icon] as React.ComponentType<{ className?: string }> : null;
        const isActive = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`group inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 font-display uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none
              ${isActive
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
              }
            `}
          >
            {IconComponent && (
              <IconComponent
                className={`w-4 h-4 transition-colors
                  ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
                `}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 17. COLLAPSIBLE ACCORDION
// ==========================================
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: keyof typeof Lucide;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const IconComponent = icon ? Lucide[icon] as React.ComponentType<{ className?: string }> : null;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm text-gray-950 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-850/50 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />}
          <span className="font-display">{title}</span>
        </div>
        <Lucide.ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800/80 text-sm text-gray-600 dark:text-gray-300 leading-relaxed leading-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 18. ACCESSIBLE ALERT BANNER
// ==========================================
interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'danger';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ title, children, variant = 'info', className = '' }) => {
  const types = {
    info: { icon: 'Info' as const, bg: 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300' },
    warning: { icon: 'AlertTriangle' as const, bg: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 text-amber-850 dark:text-amber-300' },
    success: { icon: 'CheckCircle2' as const, bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300' },
    danger: { icon: 'AlertCircle' as const, bg: 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 text-red-800 dark:text-red-300' }
  };

  const IconComponent = Lucide[types[variant].icon] as React.ComponentType<{ className?: string }>;

  return (
    <div className={`flex gap-3.5 p-4 border rounded-xl ${types[variant].bg} ${className}`} role="alert">
      <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-sm">
        {title && <h5 className="font-bold mb-1 font-display tracking-tight">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// ==========================================
// 19. REUSABLE TOOLTIP
// ==========================================
interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 px-2.5 py-1.5 text-xs text-white bg-gray-900 dark:bg-black rounded-lg border border-gray-800 shadow-md bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 20. PAGINATION FOOTER
// ==========================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3.5 border-t border-gray-150 dark:border-gray-800">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          icon="ChevronLeft"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          icon="ChevronRight"
          iconPosition="right"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// ==========================================
// 21. TEMPLATE CARD COMPONENT
// ==========================================
interface TemplateCardProps {
  template: Template;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  searchPlatform: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isFavorite,
  onToggleFavorite,
  onOpen,
  searchPlatform
}) => {
  return (
    <Card className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 hover:border-indigo-500 dark:hover:border-indigo-900 shadow-sm overflow-hidden transition-all duration-200">
      {/* Category header */}
      <div className="px-5 py-3 bg-gray-50/70 dark:bg-gray-950/40 border-b border-gray-200 dark:border-gray-850 flex items-center justify-between">
        <Badge variant={
          template.category === 'Tech' ? 'blue' :
          template.category === 'SAP' ? 'purple' :
          template.category === 'Salesforce & CRM' ? 'orange' :
          template.category === 'Healthcare' ? 'green' :
          template.category === 'Management' ? 'cyan' : 'gray'
        }>
          {template.category}
        </Badge>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-red-500 ${isFavorite ? 'text-red-500 fill-red-500 scale-105' : ''}`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Lucide.Heart className="w-4 h-4 transition-all" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold font-display text-gray-950 dark:text-white line-clamp-1">
            {template.name}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-0.5 line-clamp-1">
            {template.role}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1 mb-4 max-h-[60px] overflow-hidden">
            {template.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 dark:bg-gray-850 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800/80">
                {skill}
              </span>
            ))}
            {template.skills.length > 3 && (
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold self-center">
                +{template.skills.length - 3} more
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            icon="Zap"
            className="w-full text-xs font-bold"
            onClick={onOpen}
          >
            Launch String
          </Button>
        </div>
      </div>
    </Card>
  );
};
