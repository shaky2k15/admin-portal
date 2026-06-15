import { cn } from '@/shared/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
} as const;

export function LoadingSpinner({
  size = 'md',
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-muted-foreground/20 border-t-primary',
          sizeClasses[size],
        )}
      />
      {label && (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

interface FullPageLoaderProps {
  label?: string;
}

export function FullPageLoader({ label = 'Loading…' }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-fade-in flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-purple-500/40 [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
