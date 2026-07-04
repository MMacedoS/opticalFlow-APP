import {
  Card,
  CardHeader,
  CardContent,
  CardAction,
  CardDescription,
  CardTitle,
  CardFooter,
} from "../ui/card";

export function CardPage({
  title,
  description,
  children,
  action,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="rounded-4xl border border-border/70 bg-card/95 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      <CardFooter className="flex justify-end">{footer}</CardFooter>
    </Card>
  );
}
