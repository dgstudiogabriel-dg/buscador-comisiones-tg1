```typescript
import { NextRequest, NextResponse } from 'next/server';

interface ComisionData {
  [key: string]: { doc: string; count: number; students: string[] };
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

    if (!apiKey || !sheetId) {
      throw new Error('Faltan variables de entorno: API Key o Sheet ID');
    }

    const sheetRanges = {
      CIAN: { range: 'CIAN-Germán!A:A', doc: 'Germán' },
      MAGENTA: { range: 'MAGENTA-Gabriel!A:A', doc: 'Gabriel' },
      AMARILLA: { range: 'AMARILLA-Javier!A:A', doc: 'Javier' },
      NEGRO: { range: 'NEGRO-Kike!A:A', doc: 'Kike' },
    };

    const data: ComisionData = {};

    for (const [color, config] of Object.entries(sheetRanges)) {
      try {
        // Usar la API de Google Sheets directamente con fetch
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(config.range)}?key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error de Google Sheets: ${response.status} ${response.statusText}`);
        }

        const sheetData = await response.json();
        const values = sheetData.values || [];

        const students = values
          .map((row: string[]) => row[0])
          .filter((name: string) => name && name.trim() && name !== 'Nombre');

        data[color] = { doc: config.doc, count: students.length, students };
      } catch (sheetError) {
        console.error(`Error en pestaña ${color}:`, sheetError);
        data[color] = { doc: config.doc, count: 0, students: [] };
      }
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error en API de comisiones:', error);
    return NextResponse.json(
      {
        error: 'Error al cargar los datos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
```

5. **Guarda el archivo** (Ctrl+S o Cmd+S)

### Opción 2: Desde Terminal (Menos fácil)

1. Abre Terminal en la carpeta del proyecto
2. Ejecuta:

```bash
git add app/api/comisiones/route.ts
git commit -m "fix: Corregir autenticación con Google Sheets API"
git push origin main
```