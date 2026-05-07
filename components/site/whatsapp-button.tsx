import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  href,
  className,
  size = "default",
  variant = "secondary",
  label = "WhatsApp",
}: {
  href: string;
  label?: string;
} & Pick<ButtonProps, "size" | "variant" | "className">) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "bg-[#10B981] text-white shadow-md hover:bg-[#0ea271]",
        className
      )}
      asChild
    >
      <Link href={href} target="_blank" rel="noreferrer">
        <MessageCircle className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
