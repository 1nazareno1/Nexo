"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countryCodes } from "@/components/phone-country-codes";

const schema = z.object({
  nombre: z.string().min(1, "Nombre es requerido").max(50, "Máximo 50 caracteres"),
  especie: z.string().min(1, "Especie es requerida").max(30, "Máximo 30 caracteres"),
  raza: z.string().min(1, "Raza es requerida").max(50, "Máximo 50 caracteres"),
  color: z.string().min(1, "Color es requerido").max(30, "Máximo 30 caracteres"),
  codigoPais: z.string().regex(/^\+\d{1,3}$/, "Código de país inválido"),
  telefono: z.string().min(4, "Teléfono es requerido").max(15, "Máximo 15 caracteres").regex(/^\d+$/, "Solo números"),
});

type FormData = z.infer<typeof schema>;

interface PetRegisterFormProps {
  qrCode: string;
}

export default function PetRegisterForm({ qrCode }: PetRegisterFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

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

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setSelectedFile(null);
      setFileError("La imagen no puede pesar más de 5 MB.");
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

      const res = await fetch(`/api/qr/${encodeURIComponent(qrCode)}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          especie: data.especie,
          raza: data.raza,
          color: data.color,
          telefono: telefonoConCodigo,
          imagen_url: imageUrl,
        }),
      });

      const resJson = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(resJson.error || "No se pudo registrar la mascota. Intenta de nuevo.");
        return;
      }

      setStatus("success");
      setMessage("Mascota registrada con éxito. Redirigiendo...");
      setTimeout(() => {
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Hubo un error de red. Intenta de nuevo.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Registrar mascota para este QR</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="nombre"
            {...register("nombre")}
            placeholder="Nombre de la mascota"
            maxLength={50}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="text-xs text-gray-500">Máximo 50 caracteres.</p>
          {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="especie" className="block text-sm font-medium text-gray-700">
            Especie
          </label>
          <input
            id="especie"
            {...register("especie")}
            placeholder="Ej: Perro, Gato"
            maxLength={30}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="text-xs text-gray-500">Máximo 30 caracteres.</p>
          {errors.especie && <p className="text-red-600 text-sm">{errors.especie.message}</p>}
        </div>
        <div>
          <label htmlFor="raza" className="block text-sm font-medium text-gray-700">
            Raza
          </label>
          <input
            id="raza"
            {...register("raza")}
            placeholder="Ej: Labrador, Siamés"
            maxLength={50}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="text-xs text-gray-500">Máximo 50 caracteres.</p>
          {errors.raza && <p className="text-red-600 text-sm">{errors.raza.message}</p>}
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            id="color"
            {...register("color")}
            placeholder="Color de la mascota"
            maxLength={30}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="text-xs text-gray-500">Máximo 30 caracteres.</p>
          {errors.color && <p className="text-red-600 text-sm">{errors.color.message}</p>}
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
            Teléfono del dueño
          </label>
          <div className="mt-1 flex gap-2">
            <select
              id="codigoPais"
              {...register("codigoPais")}
              className="w-32 flex-shrink-0 rounded-lg border px-3 py-2 text-sm"
            >
              {countryCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </select>
            <input
              id="telefono"
              {...register("telefono")}
              placeholder="Número sin espacios"
              maxLength={15}
              required
              className="flex-1 rounded-lg border px-3 py-2"
            />
          </div>
          <p className="text-xs text-gray-500">Incluye el código de país en el desplegable. Máximo 15 dígitos para el número.</p>
          {errors.codigoPais && <p className="text-red-600 text-sm">{errors.codigoPais.message}</p>}
          {errors.telefono && <p className="text-red-600 text-sm">{errors.telefono.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Foto de la mascota <span className="text-gray-500">(opcional)</span>
          </label>
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
            className="mt-2 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            {selectedFile ? "Cambiar foto" : "Seleccionar foto"}
          </button>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">Archivo: {selectedFile.name}</p>
          )}
          {fileError && <p className="text-red-600 text-sm mt-1">{fileError}</p>}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview de mascota"
              className="mt-3 h-28 w-full rounded-lg object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Guardando..." : "Registrar mascota"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
