import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

type SwitchRef = React.ComponentRef<typeof SwitchPrimitives.Root>;
type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>;

const Switch = React.forwardRef<SwitchRef, SwitchProps>(({ className, ...props }, ref) => {
    return (
        <SwitchPrimitives.Root
            ref={ref}
            className={cn(
                "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
                className
            )}
            {...props}
        >
            <SwitchPrimitives.Thumb
                className="pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-background shadow transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-5"
            />
        </SwitchPrimitives.Root>
    );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
