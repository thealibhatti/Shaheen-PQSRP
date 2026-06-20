import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-800 text-white shadow-md shadow-red-950/10 hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-600/20 active:from-red-700 active:to-red-800 border border-red-500/20',
        destructive: 'bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-600/90 shadow-sm',
        outline: 'border border-border bg-background text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-muted-foreground/10',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/95',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-9 rounded-md px-3.5 text-xs',
        lg: 'h-11 rounded-xl px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };