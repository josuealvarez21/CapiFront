import { ImageResponse } from 'next/og';

export const alt = 'Cápi — controla tu destino financiero';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#090d16',
          color: 'white',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, color: '#4ade80', letterSpacing: 6 }}>
          CÁPI · FINANZAS PERSONALES
        </div>
        <div style={{ display: 'flex', fontSize: 82, fontWeight: 800, marginTop: 24 }}>
          Controla tu destino financiero
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#9ca3af', marginTop: 24 }}>
          Ingresos, gastos, metas y presupuestos con asistente IA.
        </div>
      </div>
    ),
    size,
  );
}
