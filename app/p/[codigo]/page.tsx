// app/p/[codigo]/page.tsx
import { supabase } from "@/lib/supabase";
import PetRegisterForm from "@/components/pet-register-form";
export const dynamic = 'force-dynamic';

// importaciones del otro diseño
import { Phone, MessageCircle, Dog, Palette, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-[40px] border border-emerald-100 bg-white/95 p-6 shadow-[0_25px_80px_rgba(16,185,129,0.14)] backdrop-blur-sm">
            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-inner border border-emerald-100 p-3">
                <img
                  src="/Nexo.png"
                  alt="Nexo"
                  className="h-16 w-16 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Registrar mascota</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Este collar está activo, ahora podés registrar tu mascota para que alguien pueda contactarte si la encuentra.
                </p>
              </div>
            </div>
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

  const petInfo = {
    name: mascota.nombre || 'Sin nombre',
    imageUrl: mascota.imagen_url || '/placeholder.jpg',
    breed: mascota.raza || '',
    species: mascota.especie || '',
    color: mascota.color || '',
    phone: telefono,
    observations: mascota.observaciones || ''
  };

  // 4. Render final
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first container with max width for desktop */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/Nexo.png"
              alt="NEXO Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-semibold text-gray-900">NEXO</h1>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <Check className="w-3 h-3 mr-1" />
            Collar activo
          </Badge>
        </header>

        {/* Main Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            ¡Hola! Soy {petInfo.name}
          </h2>
          <p className="text-gray-600 text-lg">
            Mi collar está activo y vinculado con mi familia.
          </p>
        </div>

        {/* Main Card */}
        <Card className="overflow-hidden border-gray-100 shadow-lg shadow-gray-100/50 mb-8">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Left side - Pet Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                <img
                  src={petInfo.imageUrl}
                  alt={`${petInfo.name} - ${petInfo.breed}`}
                  className="w-full h-full object-cover rounded-3xl shadow-xl"
                />
              </div>
            </div>

            {/* Right side - Pet Info */}
            <div className="p-8 md:p-10 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Información de la mascota
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F1EB' }}>
                    <Dog className="w-5 h-5" style={{ color: '#B8935C' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Nombre</p>
                    <p className="text-lg font-semibold text-gray-900">{petInfo.name}</p>
                  </div>
                </div>

                {/* Species */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Dog className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Especie</p>
                    <p className="text-lg font-semibold text-gray-900">{petInfo.species}</p>
                  </div>
                </div>

                {/* Breed */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F1EB' }}>
                    <Dog className="w-5 h-5" style={{ color: '#B8935C' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Raza</p>
                    <p className="text-lg font-semibold text-gray-900">{petInfo.breed}</p>
                  </div>
                </div>

                {/* Color */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Color</p>
                    <p className="text-lg font-semibold text-gray-900">{petInfo.color}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F1EB' }}>
                    <Phone className="w-5 h-5" style={{ color: '#B8935C' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Teléfono del dueño</p>
                    <p className="text-lg font-semibold text-gray-900">{petInfo.phone}</p>
                  </div>
                </div>

                {mascota.observaciones ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0" >
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Observaciones</p>
                      <p className="text-lg font-semibold text-gray-900">{petInfo.observations}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 sm:p-10 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Si encontraste a esta mascota
            </h3>
            <p className="text-gray-700 text-lg">
              Por favor contactá al dueño para ayudar a que vuelva a casa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg rounded-xl shadow-lg shadow-emerald-200/50 transition-all hover:shadow-xl hover:shadow-emerald-300/50">
              <a href={`https://wa.me/${telefono}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </Button>

            <Button asChild variant="outline" className="flex-1 border-2 h-14 text-lg rounded-xl shadow-sm transition-all" style={{ borderColor: '#B8935C', color: '#B8935C' }}>
              <a href={`tel:${telefono}`}>
                <Phone className="w-5 h-5 mr-2" />
                Llamar
              </a>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-500">
            Gracias por ayudar a que más mascotas vuelvan a casa.
          </p>
        </footer>
      </div>
    </div>
  );
}
