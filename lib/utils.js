import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return 'N/A';
  return format(new Date(date), fmt);
}

export function timeAgo(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function getCategoryColor(category) {
  const colors = {
    lab: 'bg-blue-100 text-blue-700',
    radiology: 'bg-amber-100 text-amber-700',
    prescription: 'bg-green-100 text-green-700',
    discharge: 'bg-red-100 text-red-700',
    consultation: 'bg-teal-100 text-teal-700',
    general: 'bg-slate-100 text-slate-700',
    other: 'bg-slate-100 text-slate-700',
  };
  return colors[category] || colors.general;
}

export function getCategoryIcon(category) {
  const icons = {
    lab: 'FlaskConical',
    radiology: 'Scan',
    prescription: 'Pill',
    discharge: 'ClipboardList',
    consultation: 'Stethoscope',
    general: 'FileText',
    other: 'File',
  };
  return icons[category] || 'FileText';
}

export function getStatusColor(status) {
  const colors = {
    uploaded: 'bg-slate-100 text-slate-600',
    processing: 'bg-yellow-100 text-yellow-700',
    analyzed: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.uploaded;
}

export function truncate(str, max = 80) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function generateInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
