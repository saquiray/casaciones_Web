import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function generarCodigo() {
  const fecha = new Date();
  const year = fecha.getFullYear();

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `LR-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      tipo,
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      telefono,
      correo,
      fecha_operacion,
      numero_operacion,
      servicio,
      monto,
      detalle,
      pedido,
      acepta_declaracion,
    } = body;

    // Validaciones básicas

    if (!tipo || !["RECLAMO", "QUEJA"].includes(tipo)) {
      return NextResponse.json(
        {
          error: "El tipo de reclamo no es válido.",
        },
        { status: 400 }
      );
    }

    if (!tipo_documento) {
      return NextResponse.json(
        {
          error: "Debe seleccionar un tipo de documento.",
        },
        { status: 400 }
      );
    }

    if (!numero_documento?.trim()) {
      return NextResponse.json(
        {
          error: "Debe ingresar su número de documento.",
        },
        { status: 400 }
      );
    }

    if (!nombres?.trim()) {
      return NextResponse.json(
        {
          error: "Debe ingresar sus nombres.",
        },
        { status: 400 }
      );
    }

    if (!apellidos?.trim()) {
      return NextResponse.json(
        {
          error: "Debe ingresar sus apellidos.",
        },
        { status: 400 }
      );
    }

    if (!correo?.trim()) {
      return NextResponse.json(
        {
          error: "Debe ingresar su correo electrónico.",
        },
        { status: 400 }
      );
    }

    if (!detalle?.trim()) {
      return NextResponse.json(
        {
          error: "Debe ingresar el detalle de su reclamo o queja.",
        },
        { status: 400 }
      );
    }

    if (!pedido?.trim()) {
      return NextResponse.json(
        {
          error: "Debe indicar su pedido.",
        },
        { status: 400 }
      );
    }

    if (!acepta_declaracion) {
      return NextResponse.json(
        {
          error:
            "Debe aceptar la declaración antes de enviar el formulario.",
        },
        { status: 400 }
      );
    }

    // Generar código

    let codigo = generarCodigo();

    // Evitar colisiones

    let existe = true;

    while (existe) {
      const { data } = await supabaseAdmin
        .from("libro_reclamaciones")
        .select("id")
        .eq("codigo", codigo)
        .maybeSingle();

      if (!data) {
        existe = false;
      } else {
        codigo = generarCodigo();
      }
    }

    // Insertar reclamo

    const { data, error } = await supabaseAdmin
      .from("libro_reclamaciones")
      .insert({
        codigo,
        tipo,
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        telefono: telefono || null,
        correo,
        fecha_operacion: fecha_operacion || null,
        numero_operacion: numero_operacion || null,
        servicio: servicio || null,
        monto:
          monto !== undefined &&
          monto !== null &&
          monto !== ""
            ? Number(monto)
            : null,
        detalle,
        pedido,
        acepta_declaracion,
        estado: "PENDIENTE",
      })
      .select(
        "codigo, tipo, nombres, apellidos, correo, created_at"
      )
      .single();

    if (error) {
      console.error(
        "Error insertando reclamo:",
        error
      );

      return NextResponse.json(
        {
          error:
            "No se pudo registrar el reclamo. Inténtelo nuevamente.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        mensaje:
          "Su reclamo o queja fue registrado correctamente.",
        reclamo: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error API Libro de Reclamaciones:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ocurrió un error inesperado. Inténtelo nuevamente.",
      },
      { status: 500 }
    );
  }
}