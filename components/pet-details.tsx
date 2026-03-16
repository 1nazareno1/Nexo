interface PetDetailsProps {
  breed: string;
  color: string;
  notes?: string;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground font-sans">{label}</span>
      <span className="text-sm font-semibold text-foreground font-sans">{value}</span>
    </div>
  );
}

export function PetDetails({ breed, color, notes }: PetDetailsProps) {
  return (
    <div className="px-5">
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 font-sans">
          Pet Info
        </h2>
        <DetailRow label="Breed" value={breed} />
        <DetailRow label="Color" value={color} />
      </div>

      {notes && (
        <div className="bg-accent/20 rounded-2xl p-5 mt-4 border border-accent/30">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 font-sans">
            Owner&apos;s Notes
          </h2>
          <p className="text-sm text-foreground leading-relaxed font-sans">{notes}</p>
        </div>
      )}
    </div>
  );
}
