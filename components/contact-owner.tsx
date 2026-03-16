"use client";

import { Phone, MessageCircle } from "lucide-react";

interface ContactOwnerProps {
  ownerPhone: string;
}

export function ContactOwner({ ownerPhone }: ContactOwnerProps) {
  const phoneClean = ownerPhone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${phoneClean.replace("+", "")}?text=${encodeURIComponent(
    "Hi! I found your pet and I'm reaching out via their QR tag. They are safe with me."
  )}`;
  const callUrl = `tel:${phoneClean}`;

  return (
    <div className="px-5">
      {/* Helpful message */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed font-sans text-balance">
          If you found this pet, please contact the owner.{" "}
          <span className="font-semibold text-foreground">
            Thank you for helping bring them home.
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
          aria-label="Contact owner via WhatsApp"
        >
          <MessageCircle size={24} />
          WhatsApp Owner
        </a>

        <a
          href={callUrl}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-call-btn text-call-btn-foreground font-bold text-lg font-sans shadow-md active:scale-95 transition-transform"
          aria-label={`Call owner at ${ownerPhone}`}
        >
          <Phone size={24} />
          Call Owner
        </a>
      </div>

      {/* Phone number display */}
      <p className="text-center text-sm text-muted-foreground mt-3 font-sans">
        {ownerPhone}
      </p>
    </div>
  );
}
