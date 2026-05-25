"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countryCodes } from "@/components/phone-country-codes";

const schema = z.object({
  nombre: z.string().min(1, "Nombre es requerido").max(50, "Máximo 50 caracteres"),
  especie: z.string().min(1, "Especie es requerida").max(30, "Máximo 30 caracteres"),
  raza: z.string().min(1, "Raza es requerida").max(50, "Máximo 50 caracteres"),
  color: z.string().min(1, "Color es requerido").max(30, "Máximo 30 caracteres"),
  observaciones: z.string().max(50, "Máximo 50 caracteres").optional(),
  codigoPais: z.string().regex(/^\+\d{1,3}$/, "Código de país inválido"),
  telefono: z.string().min(4, "Teléfono es requerido").max(15, "Máximo 15 caracteres").regex(/^\d+$/, "Solo números"),
});

type FormData = z.infer<typeof schema>;

type PetRegisterFormProps = {
  qrCode: string;
};

type TextFieldConfig = {
  id: "nombre" | "especie" | "raza" | "color" | "observaciones";
  label: string;
  placeholder: string;
  hint: string;
  maxLength: number;
};

const textFields: TextFieldConfig[] = [
  { id: "nombre", label: "Nombre", placeholder: "Nombre de la mascota", hint: "Máximo 50 caracteres.", maxLength: 50 },
  { id: "especie", label: "Especie", placeholder: "Ej: Perro, Gato", hint: "Máximo 30 caracteres.", maxLength: 30 },
  { id: "raza", label: "Raza", placeholder: "Ej: Labrador, Siamés", hint: "Máximo 50 caracteres.", maxLength: 50 },
  { id: "color", label: "Color", placeholder: "Color de la mascota", hint: "Máximo 30 caracteres.", maxLength: 30 },
  { id: "observaciones", label: "Observaciones", placeholder: "Ej: no puede comer alimentos especiales", hint: "Máximo 50 caracteres.", maxLength: 50 },
];

function TextField({
  id,
  label,
  placeholder,
  hint,
  maxLength,
  register,
  error,
}: {
  id: "nombre" | "especie" | "raza" | "color" | "observaciones";
  label: string;
  placeholder: string;
  hint: string;
  maxLength: number;
  register: UseFormRegister<FormData>;
  error?: FieldError;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={id}
        {...register(id)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 focus:ring-inset"
      />
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{hint}</span>
        {error?.message ? <span className="text-red-600">{error.message}</span> : null}
      </div>
    </div>
  );
}

export default function PetRegisterForm({ qrCode }: PetRegisterFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigoPais: "+54",
    },
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      setFileError("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSelectedFile(null);
      setFileError("El archivo debe ser una imagen.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setFileError("La imagen no puede pesar más de 10 MB.");
      return;
    }

    setSelectedFile(file);
    setFileError("");
  }

  async function onSubmit(data: FormData) {
    setStatus("loading");
    setMessage("");

    if (fileError) {
      setStatus("error");
      setMessage(fileError);
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadJson = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadJson.url) {
          setStatus("error");
          setMessage(uploadJson.error || "No se pudo subir la imagen.");
          return;
        }

        imageUrl = uploadJson.url;
      }

      const telefonoConCodigo = `${data.codigoPais}${data.telefono}`;

      const response = await fetch(`/api/qr/${encodeURIComponent(qrCode)}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          especie: data.especie,
          raza: data.raza,
          color: data.color,
          observaciones: data.observaciones,
          telefono: telefonoConCodigo,
          imagen_url: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error || "No se pudo registrar la mascota. Intenta de nuevo.");
        return;
      }

      setStatus("success");
      setMessage("Mascota registrada con éxito. Redirigiendo...");
      setTimeout(() => router.refresh(), 6200);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Hubo un error de red. Intenta de nuevo.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] border border-emerald-100 bg-white/95 p-6 shadow-[0_20px_80px_rgba(16,185,129,0.12)]">
      <div className="mb-6 rounded-3xl bg-emerald-50 px-4 py-4 text-center text-sm font-semibold text-emerald-800 shadow-sm">
        Información de tu mascota
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {textFields.map((field) => (
          <TextField
            key={field.id}
            id={field.id}
            label={field.label}
            placeholder={field.placeholder}
            hint={field.hint}
            maxLength={field.maxLength}
            register={register}
            error={errors[field.id] as FieldError | undefined}
          />
        ))}

        <div className="space-y-2">
          <label htmlFor="telefono" className="block text-sm font-semibold text-slate-800">
            Teléfono del dueño
          </label>
          <div className="flex gap-3">
            <select
              id="codigoPais"
              {...register("codigoPais")}
              className="w-32 flex-shrink-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 focus:ring-inset"
            >
              {countryCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.value}
                </option>
              ))}
            </select>
            <input
              id="telefono"
              {...register("telefono")}
              placeholder="Número sin espacios"
              maxLength={15}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 focus:ring-inset"
            />
          </div>
          <div className="text-xs text-slate-500">
            Incluye el código de país en el desplegable. Máximo 15 dígitos para el número.
          </div>
          <div className="space-y-1 text-sm text-red-600">
            {errors.codigoPais && <p>{errors.codigoPais.message}</p>}
            {errors.telefono && <p>{errors.telefono.message}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Foto de la mascota</span>
            <span className="text-xs text-slate-500">(opcional)</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="pet-image-input"
          />
          <button
            type="button"
            onClick={openFilePicker}
            className="inline-flex w-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50"
          >
            {selectedFile ? "Cambiar foto" : "Seleccionar foto"}
          </button>
          {fileError ? <p className="text-sm text-red-600">{fileError}</p> : null}
          {previewUrl ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={previewUrl} alt="Preview de mascota" className="h-32 w-full object-cover" />
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Guardando..." : "Registrar mascota"}
        </button>
      </form>

      {message ? (
        <p className={`mt-4 text-center text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
