import { Pencil, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

type FormProps = {
  children: React.ReactNode;
  title: string;
  width?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  icon?: LucideIcon;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DialogForm({
  children,
  title,
  variant = "default",
  width = "max-w-300!",
  icon: Icon = Pencil,
  open,
  onOpenChange,
}: FormProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* A variante vai no proprio Button: combinar classes de variantes
            diferentes deixava o texto branco sobre fundo claro. */}
        <DialogTrigger
          render={
            <Button
              variant={variant}
              size="sm"
              className="flex items-center gap-2"
            >
              <Icon className="size-4" />
              <span>{title}</span>
            </Button>
          }
        />
        <DialogContent
          className={`mt-4 max-h-dvh overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border/50 scrollbar-track-transparent ${width} `}
        >
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
