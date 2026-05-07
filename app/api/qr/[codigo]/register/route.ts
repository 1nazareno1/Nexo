import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params?: Promise<{ codigo?: string }> } = {}) {
  const { codigo } = params ? await params : {};
  const codigoQr = codigo || (() => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split("/").filter(Boolean);
      const qrIndex = pathSegments.indexOf("qr");
      return qrIndex >= 0 ? pathSegments[qrIndex + 1] : undefined;
    } catch {
      return undefined;
    }
  })();

  if (!codigoQr) {
    return NextResponse.json({ error: "Falta código QR." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { nombre, especie, raza, color, telefono, imagen_url } = body as Record<string, any>;
  if (!nombre || !especie || !raza || !color || !telefono) {
    return NextResponse.json({ error: "Campos incompletos." }, { status: 400 });
  }

  const { data: qr, error: qrError } = await supabase
    .from("QR")
    .select("*")
    .eq("codigo_qr", codigo)
    .maybeSingle();

  if (qrError) {
    return NextResponse.json({ error: "Error al leer QR." }, { status: 500 });
  }

  if (!qr) {
    return NextResponse.json({ error: "QR no existe." }, { status: 404 });
  }

  if (!qr.activo) {
    return NextResponse.json({ error: "El QR no está activado." }, { status: 400 });
  }

  if (qr.id_mascota) {
    return NextResponse.json({ error: "Este QR ya tiene mascota asignada." }, { status: 409 });
  }

  let id_usuario = null;

  const { data: usuarioExistente, error: userError } = await supabase
    .from("USUARIO")
    .select("id_usuario")
    .eq("telefono", telefono)
    .maybeSingle();

  if (userError) {
    return NextResponse.json({ error: "Error al buscar usuario." }, { status: 500 });
  }

  if (usuarioExistente) {
    id_usuario = usuarioExistente.id_usuario;
  } else {
    const { data: nuevoUsuario, error: userCreateError } = await supabase
      .from("USUARIO")
      .insert({ telefono })
      .select("id_usuario")
      .maybeSingle();

    if (userCreateError || !nuevoUsuario) {
      return NextResponse.json({ error: "No se pudo crear usuario." }, { status: 500 });
    }

    id_usuario = nuevoUsuario.id_usuario;
  }

  const { data: mascota, error: petError } = await supabase
    .from("MASCOTA")
    .insert({ id_usuario, nombre, especie, raza, color, imagen_url })
    .select("id_mascota")
    .maybeSingle();

  if (petError || !mascota) {
    return NextResponse.json({ error: "No se pudo crear mascota." }, { status: 500 });
  }

  const { data: updatedQR, error: qrUpdateError } = await supabase
    .from("QR")
    .update({ id_mascota: mascota.id_mascota })
    .eq("codigo_qr", codigo)
    .select("*")
    .maybeSingle();

  if (qrUpdateError) {
    return NextResponse.json({ error: "No se pudo asociar mascota al QR." }, { status: 500 });
  }

  return NextResponse.json({ success: true, mascota, qr: updatedQR });
}
