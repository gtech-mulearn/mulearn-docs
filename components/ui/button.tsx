import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#0961F5] text-white border border-[#0054E8] shadow-[inset_0px_6px_11px_0px_rgba(255,255,255,0.33),inset_0px_-6px_17px_0px_rgba(0,0,0,0.18),0px_4px_7px_0px_rgba(0,0,0,0.18)] hover:opacity-95 rounded-full font-sans",
        destructive:
          "bg-destructive text-mulearn-whitish hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-[#2E85FE] text-[#2E85FE] hover:bg-linear-to-r hover:bg-mulearn-trusty-blue hover:text-[#fefefe] font-bold cursor-pointer   transition-all duration-300",
        secondary:
          "bg-[#c4c4c4] text-[#1a1a1a] hover:bg-[#a3a3a3] border border-[#c4c4c4] transition-all duration-300 font-bold cursor-pointer ",
        ghost:
          "text-transparent bg-linear-to-r from-[#6366f1] to-[#2E85FE] bg-clip-text hover:bg-[#6366f1]/10 transition-all font-bold cursor-pointer duration-300",
        link: "text-primary underline-offset-4 hover:underline",
        blue: "bg-mulearn-trusty-blue text-mulearn-whitish rounded-full text-base hover:bg-mulearn-duke-purple active:bg-mulearn-trusty-blue transition-all duration-300 font-bold cursor-pointer  rounded-full cursor-pointer",
        inverted:
          "bg-mulearn-whitish text-mulearn-trusty-blue hover:bg-mulearn-whitish/90 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 font-bold cursor-pointer ",
        mulearn:
          "bg-linear-to-r from-[#6366f1] to-[#2E85FE] text-[#fefefe] hover:from-[#5856eb] hover:to-[#1d4ed8] shadow-lg hover:shadow-xl font-bold cursor-pointer   transition-all duration-300 rounded-full cursor-pointer",
        purple:
          "bg-[#AF2EE6] text-[#fefefe] hover:bg-[#9333ea] shadow-lg hover:shadow-xl transition-all duration-300 font-bold cursor-pointer ",
        trusty:
          "bg-linear-to-r from-[#6366f1] to-[#2E85FE] text-[#fefefe] hover:from-[#5856eb] hover:to-[#1d4ed8] shadow-lg hover:shadow-2xl  transition-all duration-300 font-bold cursor-pointer ",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const { popover, ...restProps } = props as any;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...restProps}
    />
  );
}

export { Button, buttonVariants };
