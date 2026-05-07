// app/p/[codigo]/page.tsx
import { supabase } from "@/lib/supabase";
import PetRegisterForm from "@/components/pet-register-form";
export const dynamic = 'force-dynamic';

export default async function Page({ params }: any) {
  const { codigo } = await params;

  // 1. Buscar QR
  const { data: qr, error: errorQR } = await supabase
    .from("QR")
    .select("*")
    .eq("codigo_qr", codigo)
    .maybeSingle();

  if (errorQR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Error interno</h2>
        <p className="text-gray-600">Intenta nuevamente más tarde.</p>
      </div>
    );
  }

  // QR no existe
  if (!qr) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <span className="text-6xl mb-4">❌</span>
        <h2 className="text-2xl font-bold mb-2">QR no encontrado</h2>
        <p className="text-gray-600">Verifica el código</p>
      </div>
    );
  }

  // QR sin activar
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

  // QR activo pero sin mascota vinculada -> formulario de carga
  if (!qr.id_mascota) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg px-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center gap-3 mb-5">
              <img src="/icon.svg" alt="Nexo" className="h-12 w-12" />
              <h1 className="text-2xl font-bold">Registrar mascota</h1>
            </div>
            <p className="text-gray-600 mb-5">
              Este collar está activo, ahora podés registrar tu mascota para que alguien pueda contactarte si la encuentra.
            </p>
            <PetRegisterForm qrCode={codigo} />
          </div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decoraciones de fondo sutiles */}
      <div className="absolute top-20 left-8 text-5xl opacity-10 pointer-events-none">🌿</div>
      <div className="absolute top-32 right-10 text-4xl opacity-10 pointer-events-none">🍃</div>
      <div className="absolute bottom-40 left-12 text-4xl opacity-10 pointer-events-none">🐾</div>
      <div className="absolute bottom-24 right-16 text-5xl opacity-10 pointer-events-none">🌱</div>
      <div className="absolute top-1/2 right-1/4 text-3xl opacity-5 pointer-events-none">✿</div>
      
      <div className="relative z-10">
        {/* Cintas/Ribbons del collar */}
        <div className="flex justify-center gap-12 mb-3">
          <div className="w-6 h-12 bg-gradient-to-b from-green-700 to-green-800 rounded-b shadow-md" style={{transform: 'skewX(-10deg)'}}></div>
          <div className="w-6 h-12 bg-gradient-to-b from-green-700 to-green-800 rounded-b shadow-md" style={{transform: 'skewX(10deg)'}}></div>
        </div>

        {/* Tarjeta premium - Collar */}
        <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm border-2 border-green-200 relative" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(180, 200, 140, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(200, 150, 100, 0.05) 0%, transparent 50%)'
        }}>
          {/* Anilla superior metálica */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-14 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg border-2 border-yellow-700"></div>

          {/* Header con logo nexo */}
          <div className="bg-gradient-to-b from-green-100 to-amber-50 px-6 pt-8 pb-4 text-center border-b border-green-100">
            <h2 className="text-lg font-bold text-green-800">nexo</h2>
            <p className="text-xs text-green-700 font-medium">Collar de identificación</p>
          </div>

          {/* Contenido principal */}
          <div className="px-6 py-6">
            {/* Marco decorativo con imagen */}
            <div className="mb-6 flex justify-center relative">
              {/* Decoración superior */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 text-xl opacity-40">
                👁️
              </div>
              <div className="absolute top-2 left-0 text-xs opacity-30">🍃</div>
              <div className="absolute top-2 right-0 text-xs opacity-30">🍃</div>

              {/* Marco y imagen */}
              {mascota.imagen_url && (
                <div className="relative w-44 h-44">
                  {/* Anillo decorativo exterior */}
                  <div className="absolute -inset-3 border-4 border-green-200 rounded-2xl opacity-40"></div>
                  
                  {/* Contenedor con sombra suave */}
                  <div className="relative h-full w-full bg-white rounded-2xl shadow-lg border-4 border-green-100 overflow-hidden">
                    <img
                      src={mascota.imagen_url}
                      alt={mascota.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Decoración inferior */}
              <div className="absolute bottom-0 left-2 text-xs opacity-30">🐾</div>
              <div className="absolute bottom-0 right-2 text-xs opacity-30">🐾</div>
            </div>

            {/* Nombre en lowercase, grande y elegante */}
            <h1 className="text-3xl font-bold text-amber-900 text-center mb-1 tracking-wide">{mascota.nombre.toLowerCase()}</h1>

            {/* Especie y raza */}
            <p className="text-center text-sm text-amber-800 font-semibold mb-1">
              {mascota.especie} • {mascota.raza}
            </p>

            {/* Color */}
            <p className="text-center text-xs text-amber-700 mb-5">Color: {mascota.color}</p>

            {/* Separador decorativo */}
            <div className="flex items-center justify-center gap-2 mb-4 opacity-30">
              <span className="text-xs">✿</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
              <span className="text-xs">✿</span>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-gradient-to-r from-green-100 to-lime-100 text-amber-900 text-xs p-3 rounded-2xl mb-5 border border-green-200 shadow-sm text-center leading-relaxed font-medium">
              Si encontraste esta mascota, por favor contactá a su dueño 🙏
            </div>

            {/* Botones mejorados */}
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${telefono.replace(/\s+/g, "")}`}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <span>📞</span>
                <span>Llamar</span>
              </a>

              <a
                href={`https://wa.me/${telefono.replace(/\D/g, "")}`}
                target="_blank"
                className="bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="bg-gradient-to-t from-green-100 to-transparent px-6 py-4 flex justify-center gap-3 text-lg opacity-30">
            <span>🌿</span>
            <span>🐾</span>
            <span>🌿</span>
          </div>
        </div>
      </div>
    </div>
  );
}
