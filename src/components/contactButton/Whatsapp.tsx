import { MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";
import { openWhatsApp } from "@/utils/whatsapp";

export function WhatsappButton({
  numero,
  message,
}: {
  numero: string;
  message: string;
}) {
  return (
    <Button
      onClick={() => openWhatsApp(numero, message)}
      variant="outline"
      className="ml-2 bg-green-600 text-white hover:bg-accent/80"
      size="sm"
    >
      <MessageCircleMore className="h-4 w-4 size-4 text-white-50" />
    </Button>
  );
}
