interface ScanInfoProps {
  scanLocation?: string;
  scanTimestamp?: string;
}

export function ScanInfo({ scanLocation, scanTimestamp }: ScanInfoProps) {
  if (!scanLocation && !scanTimestamp) return null;

  return (
    <div className="px-5">
      <div className="bg-muted rounded-2xl p-4 border border-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 font-sans">
          Detalles del escaneo
        </h2>
        <div className="flex flex-col gap-2">
          {scanTimestamp && (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-sm text-foreground font-sans">{scanTimestamp}</span>
            </div>
          )}
          {scanLocation && (
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm text-foreground font-sans">{scanLocation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
