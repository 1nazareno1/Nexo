import Image from "next/image";

interface PetHeroProps {
  petName: string;
  species: string;
  photoUrl: string;
}

export function PetHero({ petName, species, photoUrl }: PetHeroProps) {
  return (
    <div className="relative w-full">
      {/* Pet photo */}
      <div className="relative w-full aspect-square overflow-hidden rounded-b-3xl">
        <Image
          src={photoUrl}
          alt={`Photo of ${petName} the ${species}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        {/* Pet name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-sm font-semibold tracking-widest uppercase text-white/70 font-sans">
            {species}
          </p>
          <h1 className="text-5xl font-extrabold text-white font-sans text-balance">
            {petName}
          </h1>
        </div>
      </div>
    </div>
  );
}
