import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            "fixed bottom-12 right-4 z-[100] flex max-h-screen w-full max-w-[calc(100vw-32px)] flex-col gap-2 sm:max-w-[360px]",
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-start justify-between gap-2 overflow-hidden rounded-lg border p-3 pr-5 text-sm shadow-md transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                default: "border-border/70 bg-background/95 text-foreground",
                success: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700",
                destructive: "border-destructive/60 bg-destructive/10 text-destructive",
                warning: "border-amber-500/60 bg-amber-500/10 text-amber-700",
                info: "border-primary/40 bg-primary/5 text-primary",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>;

const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Root>,
    ToastProps
>(({ className, variant, ...props }, ref) => (
    <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
    />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Action>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-transparent px-3 text-xs font-medium transition hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

const ToastClose = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        className={cn(
            "absolute right-2 top-2 rounded-md p-1 text-foreground/80 transition hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
            className
        )}
        toast-close=""
        {...props}
    />
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Title>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Description ref={ref} className={cn("text-xs text-foreground/80", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    toastVariants,
};

export type { ToastActionElement, ToastProps };
