import { useRef } from "react";
import { Upload, X } from "lucide-react";

type Props = {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  height?: string;
  className?: string;
};

export function ImageUpload({ value, onChange, label = "Click to upload", height = "h-40", className = "" }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result;
      if (typeof url === "string") onChange(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className={`relative ${height} w-full overflow-hidden rounded-2xl border border-border`}>
          <img src={value} alt="upload preview" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-white"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-destructive hover:bg-white"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`flex ${height} w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-secondary/30 px-6 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors`}
        >
          <Upload className="h-7 w-7 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">PNG / JPG up to 5MB</p>
        </button>
      )}
    </div>
  );
}
