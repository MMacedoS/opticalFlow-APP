import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export function CardList({
  title,
  description,
  action,
  content,
  footer,
  itemChildren,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  itemChildren?: React.ReactNode;
}) {
  return (
    <>
      <Card className="rounded-4xl border border-border/70 shadow-lg bg-zinc-100 hover:bg-zinc-300 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
          <CardAction>{action}</CardAction>
        </CardHeader>
        <CardContent className="space-y-2">{content}</CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex justify-end gap-2">{footer}</CardFooter>
      </Card>
      {itemChildren}
    </>
  );
}
