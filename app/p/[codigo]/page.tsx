// app/p/[codigo]/page.tsx
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic';

export default async function Page({ params }: any) {
  const { codigo } = await params;



  // 1. Buscar QR
  const { data: qr, error: errorQR } = await supabase
    .from("QR")
    .select("*")
    .eq("codigo_qr", codigo)
    .maybeSingle();


  

  //  QR no existe
  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <span className="text-6xl mb-4">❌</span>
        <h2 className="text-2xl font-bold mb-2">QR no encontrado</h2>
        <p className="text-gray-600">Verifica el código</p>
      </div>
    );
  }

  //  QR sin activar
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


  const { data: mascota, error: errorMascota } = await supabase
    .from("MASCOTA")
    .select("*")
    .eq("id_mascota", qr.id_mascota)
    .maybeSingle();



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
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">

      {/* Imagen */}
      {mascota.imagen_url && (
        <img
          src={mascota.imagen_url}
          alt={mascota.nombre}
          className="w-40 h-40 object-cover rounded-xl mx-auto mb-4"
        />
      )}

      {/* Nombre */}
      <h1 className="text-2xl font-bold mb-1">
        {mascota.nombre}
      </h1>

      {/* Info básica */}
      <p className="text-gray-600 mb-2">
        {mascota.especie} • {mascota.raza}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Color: {mascota.color}
      </p>

      {/* Mensaje humano */}
      <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg mb-4">
        Si encontraste esta mascota, por favor contactá a su dueño 🙏
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3">
        <a
          href={`tel:${telefono.replace(/\s+/g, "")}`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          📞 Llamar
        </a>

        <a
          href={`https://wa.me/${telefono.replace(/\D/g, "")}`}
          target="_blank"
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition"
        >
          💬 WhatsApp
        </a>
      </div>

    </div>
  </div>
);
}