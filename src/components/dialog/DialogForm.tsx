import { Pencil, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { buttonVariants } from "../ui/button";

type FormProps = {
  children: React.ReactNode;
  title: string;
  width?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  icon?: LucideIcon;
};

export function DialogForm({
  children,
  title,
  variant = "default",
  width = "max-w-300!",
  icon: Icon = Pencil,
}: FormProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger
          className={buttonVariants({
            variant: variant,
            size: "sm",
          })}
        >
          <Icon className="size-4" />
          <span>{title}</span>
        </DialogTrigger>
        <DialogContent
          className={`${width} mt-4 max-h-dvh overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border/50 scrollbar-track-transparent`}
        >
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
