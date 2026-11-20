'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ============================================================
// BUTTON
// ============================================================
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:opacity-90 active:opacity-80',
  secondary: 'bg-surface border border-border-strong text-ink hover:bg-fill-1 active:bg-fill-2',
  ghost: 'bg-transparent text-ink-2 hover:text-ink hover:bg-fill-1 active:bg-fill-2',
  danger: 'bg-surface border border-border-strong text-ink hover:bg-fill-1 active:bg-fill-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-9 px-4 text-sm gap-2',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-[var(--radius-sm)] transition-default
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================
// BADGE / STATUS PILL
// ============================================================
export type BadgeVariant = 'outline' | 'solid' | 'dashed';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'outline', className = '', icon }: BadgeProps) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap';
  const variantClass =
    variant === 'solid'
      ? 'bg-ink text-white'
      : variant === 'dashed'
      ? 'border border-dashed border-border-strong text-ink-2'
      : 'border border-border-strong text-ink-2';

  return (
    <span className={`${base} ${variantClass} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// ============================================================
// CARD
// ============================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-md)] ${padding ? 'p-4' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ============================================================
// TABLE
// ============================================================
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="sticky top-0 bg-surface z-10">{children}</thead>;
}

export function TableHeaderCell({ children, className = '', align = 'left', onClick }: { children: React.ReactNode; className?: string; align?: 'left' | 'right' | 'center'; onClick?: () => void }) {
  return (
    <th onClick={onClick} className={`micro-label px-3 py-2.5 border-b border-border text-${align} font-medium ${className}`}>
      {children}
    </th>
  );
}

export function TableRow({ children, className = '', onClick, hoverable = true }: { children: React.ReactNode; className?: string; onClick?: () => void; hoverable?: boolean }) {
  return (
    <tr
      className={`border-b border-border ${hoverable ? 'hover:bg-fill-1 transition-default' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', align = 'left', mono = false }: { children: React.ReactNode; className?: string; align?: 'left' | 'right' | 'center'; mono?: boolean }) {
  return (
    <td className={`px-3 py-2 h-10 text-${align} ${mono ? 'mono' : ''} ${className}`}>
      {children}
    </td>
  );
}

// ============================================================
// TABS
// ============================================================
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-0 border-b border-border ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-sm font-medium transition-default border-b-2 -mb-px cursor-pointer
            ${activeTab === tab.id
              ? 'border-ink text-ink'
              : 'border-transparent text-ink-3 hover:text-ink-2'
            }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-ink text-white' : 'bg-fill-2 text-ink-3'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// SEGMENTED CONTROL
// ============================================================
interface SegmentedProps {
  options: { id: string; label: string; badge?: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Segmented({ options, value, onChange, className = '' }: SegmentedProps) {
  return (
    <div className={`inline-flex items-center bg-fill-1 rounded-[var(--radius-sm)] p-0.5 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-[4px] transition-default cursor-pointer whitespace-nowrap
            ${value === opt.id
              ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
              : 'text-ink-3 hover:text-ink-2'
            }`}
        >
          {opt.label}
          {opt.badge && (
            <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded bg-fill-2 text-ink-3">{opt.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    // Focus trap
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative bg-surface rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-float)] ${maxWidth} w-full mx-4 max-h-[85vh] overflow-y-auto fade-in`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-[var(--radius-sm)] hover:bg-fill-1 transition-default cursor-pointer" aria-label="Close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// DRAWER
// ============================================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, side = 'right', width = 'w-80' }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full ${width} bg-surface border-${side === 'right' ? 'l' : 'r'} border-border shadow-[var(--shadow-float)] flex flex-col fade-in`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-[var(--radius-sm)] hover:bg-fill-1 transition-default cursor-pointer" aria-label="Close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// POPOVER (simplified)
// ============================================================
interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Popover({ trigger, children, align = 'left', className = '' }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'} z-50 bg-surface border border-border rounded-[var(--radius-md)] shadow-[var(--shadow-float)] min-w-[200px] fade-in`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOAST SYSTEM
// ============================================================
interface Toast {
  id: string;
  message: string;
  undoAction?: () => void;
}

interface ToastContextType {
  showToast: (message: string, undoAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, undoAction?: () => void) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, undoAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-enter bg-ink text-white px-4 py-2.5 rounded-[var(--radius-sm)] text-sm flex items-center gap-3 shadow-[var(--shadow-float)] max-w-sm">
            <span className="flex-1">{toast.message}</span>
            {toast.undoAction && (
              <button
                onClick={() => { toast.undoAction?.(); dismiss(toast.id); }}
                className="text-xs font-medium underline underline-offset-2 opacity-80 hover:opacity-100 cursor-pointer"
              >
                Undo
              </button>
            )}
            <button onClick={() => dismiss(toast.id)} className="opacity-60 hover:opacity-100 cursor-pointer" aria-label="Dismiss">
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================
// SWITCH
// ============================================================
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helperText?: string;
}

export function Switch({ checked, onChange, label, helperText }: SwitchProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-9 h-5 rounded-full transition-default flex-shrink-0 cursor-pointer
          ${checked ? 'bg-ink' : 'bg-fill-3'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-150 ease-out
          ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
      {(label || helperText) && (
        <div>
          {label && <span className="text-sm font-medium text-ink">{label}</span>}
          {helperText && <p className="text-xs text-ink-3 mt-0.5">{helperText}</p>}
        </div>
      )}
    </label>
  );
}

// ============================================================
// SKELETON
// ============================================================
export function Skeleton({ className = '', width, height }: { className?: string; width?: string; height?: string }) {
  return <div className={`skeleton ${className}`} style={{ width, height }} />;
}

// ============================================================
// INPUT
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {icon && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3">{icon}</span>}
      <input
        className={`w-full h-8 ${icon ? 'pl-8' : 'pl-3'} pr-3 text-sm bg-surface border border-border rounded-[var(--radius-sm)] text-ink placeholder:text-ink-3 hover:border-border-strong focus:border-ink focus:outline-none transition-default`}
        {...props}
      />
    </div>
  );
}

// ============================================================
// SELECT
// ============================================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`h-8 px-3 pr-8 text-sm bg-surface border border-border rounded-[var(--radius-sm)] text-ink hover:border-border-strong focus:border-ink focus:outline-none transition-default appearance-none cursor-pointer ${className}`}
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23737373\' stroke-width=\'1.5\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Confirm' }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-2 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================
interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="text-sm text-ink-3 mt-1">{description}</p>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="border-b border-border mt-4" />
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-ink-3 mb-2">{message}</p>
      {action && (
        <button onClick={action.onClick} className="text-sm text-ink underline underline-offset-2 hover:no-underline cursor-pointer transition-default">
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS BAR (thin black)
// ============================================================
interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`h-0.5 bg-fill-2 rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-ink rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

