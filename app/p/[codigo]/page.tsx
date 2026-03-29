// app/p/[codigo]/page.tsx
import { supabase } from "@/lib/supabase";

export default async function Page({ params }: any) {
  const { codigo } = await params;

  console.log("codigo:", codigo);

  // 1. Buscar QR
  const { data: qr, error: errorQR } = await supabase
    .from("QR")
    .select("*")
    .eq("codigo_qr", codigo)
    .maybeSingle();

  console.log("qr:", qr);
  console.log("errorQR:", errorQR);

  // ❌ QR no existe
  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <span className="text-6xl mb-4">❌</span>
        <h2 className="text-2xl font-bold mb-2">QR no encontrado</h2>
        <p className="text-gray-600">Verifica el código</p>
      </div>
    );
  }

  // ❌ QR sin activar
  if (!qr.activo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold mb-4">QR sin activar</h1>
        <a
          href={`/activar/${codigo}`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Activar mascota
        </a>
      </div>
    );
  }

  // 2. Buscar mascota
  console.log("qr.id_mascota:", qr.id_mascota);

  const { data: mascota, error: errorMascota } = await supabase
    .from("MASCOTA")
    .select("*")
    .eq("id_mascota", qr.id_mascota)
    .maybeSingle();

  console.log("mascota:", mascota);
  console.log("errorMascota:", errorMascota);

  if (!mascota) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold">Error cargando mascota</h1>
        <p>Revisá la relación entre QR y Mascota</p>
      </div>
    );
  }

  // 3. traer usuario
  const { data: usuario } = await supabase
    .from("USUARIO")
    .select("telefono")
    .eq("id_usuario", mascota.id_usuario)
    .maybeSingle();

  const telefono = usuario?.telefono || "";

  // 4. Render final
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <span className="text-5xl mb-6">🐾</span>
      <h1 className="text-3xl font-bold mb-2">{mascota.nombre}</h1>
      <p className="text-lg text-gray-700 mb-1">
        {mascota.especie} • {mascota.raza}
      </p>
      <p className="text-md text-gray-500 mb-4">
        Color: {mascota.color}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href={`tel:${telefono.replace(/\s+/g, "")}`}
          className="bg-blue-600 text-white py-3 rounded-lg text-center"
        >
          Llamar
        </a>

        <a
          href={`https://wa.me/${telefono.replace(/\D/g, "")}`}
          target="_blank"
          className="bg-green-500 text-white py-3 rounded-lg text-center"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}