"use client";

import { Phone, MessageCircle } from "lucide-react";

interface ContactOwnerProps {
  ownerPhone: string;
}

export function ContactOwner({ ownerPhone }: ContactOwnerProps) {
  const phoneClean = ownerPhone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${phoneClean.replace("+", "")}?text=${encodeURIComponent(
    "Hola, encontré a tu mascota y te contacto a través de su etiqueta QR. Está a salvo conmigo."
  )}`;
  const callUrl = `tel:${phoneClean}`;

  return (
    <div className="px-5">
      {/* Helpful message */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed font-sans text-balance">
          Si encontraste a esta mascota, por favor contacta al dueño.{" "}
          <span className="font-semibold text-foreground">
            Gracias por ayudar a que vuelva a casa.
          </span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-whatsapp-btn text-whatsapp-btn-foreground font-bold text-lg font-sans shadow-md active:scale-95 transition-transform"
          aria-label="Contactar al dueño por WhatsApp"
        >
          <MessageCircle size={24} />
          WhatsApp al dueño
        </a>

        <a
          href={callUrl}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-call-btn text-call-btn-foreground font-bold text-lg font-sans shadow-md active:scale-95 transition-transform"
          aria-label={`Llamar al dueño al ${ownerPhone}`}
        >
          <Phone size={24} />
          Llamar al dueño
        </a>
      </div>

      {/* Phone number display */}
      <p className="text-center text-sm text-muted-foreground mt-3 font-sans">
        {ownerPhone}
      </p>
    </div>
  );
}
