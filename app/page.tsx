import { PetHero } from "@/components/pet-hero";
import { PetDetails } from "@/components/pet-details";
import { ContactOwner } from "@/components/contact-owner";
import { ScanInfo } from "@/components/scan-info";

// Example pet data — in production this would come from an API/database via the URL params
const petData = {
  petName: "Luna",
  species: "Perro",
  breed: "Golden Retriever",
  color: "Dorado",
  notes: "Muy amigable pero tímido con extraños.",
  ownerPhone: "+5491112345678",
  photoUrl: "/pet-photo.jpg",
  // Optional scan metadata
  scanLocation: "Parque Rivadavia, Buenos Aires",
  scanTimestamp: new Date().toLocaleString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
};

export default function FoundPetPage() {
  const {
    petName,
    species,
    breed,
    color,
    notes,
    ownerPhone,
    photoUrl,
    scanLocation,
    scanTimestamp,
  } = petData;

  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-md">
        {/* Hero: big pet photo with name overlay */}
        <PetHero petName={petName} species={species} photoUrl={photoUrl} />

        {/* Content stack */}
        <div className="flex flex-col gap-5 pb-10 pt-6">
          {/* Contact buttons — highest priority, shown first */}
          <ContactOwner ownerPhone={ownerPhone} />

          {/* Pet details */}
          <PetDetails breed={breed} color={color} notes={notes} />

          {/* Optional scan metadata */}
          <ScanInfo scanLocation={scanLocation} scanTimestamp={scanTimestamp} />
        </div>
      </div>
    </main>
  );
}
