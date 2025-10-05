import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const statusConfig = {
  // Application statuses
  applied: { variant: 'secondary' as const, label: 'Applied' },
  shortlisted: { variant: 'default' as const, label: 'Shortlisted' },
  rejected: { variant: 'destructive' as const, label: 'Rejected' },
  ongoing: { variant: 'default' as const, label: 'Ongoing' },
  completed: { variant: 'secondary' as const, label: 'Completed' },
  
  // MoU statuses
  draft: { variant: 'outline' as const, label: 'Draft' },
  pending_signatures: { variant: 'secondary' as const, label: 'Pending Signatures' },
  mou_active: { variant: 'default' as const, label: 'Active' },
  expiring: { variant: 'destructive' as const, label: 'Expiring' },
  terminated: { variant: 'destructive' as const, label: 'Terminated' },
  
  // Internship statuses
  active: { variant: 'default' as const, label: 'Active' },
  inactive: { variant: 'secondary' as const, label: 'Inactive' },
  closed: { variant: 'destructive' as const, label: 'Closed' },
  
  // General statuses
  approved: { variant: 'default' as const, label: 'Approved' },
  pending: { variant: 'secondary' as const, label: 'Pending' },
  cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: 'secondary' as const,
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  };

  return (
    <Badge 
      variant={variant || config.variant} 
      className={cn(className)}
    >
      {config.label}
    </Badge>
  );
}


