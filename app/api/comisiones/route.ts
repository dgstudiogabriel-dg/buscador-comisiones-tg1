import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface ComisionData {
  [key: string]: { doc: string; count: number; students: string[] };
}

export async function GET(request: NextRequest) {
  try {
    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.GOOGLE_SHEETS_API_KEY,
    });

    const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
    const sheetRanges = {
      CIAN: { range: 'CIAN-Germán!A:A', doc: 'Germán' },
      MAGENTA: { range: 'MAGENTA-Gabriel!A:A', doc: 'Gabriel' },
      AMARILLA: { range: 'AMARILLA-Javier!A:A', doc: 'Javier' },
      NEGRO: { range: 'NEGRO-Kike!A:A', doc: 'Kike' },
    };

    const data: ComisionData = {};

    for (const [color, config] of Object.entries(sheetRanges)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: config.range,
      }, {
        headers: {
          referer: 'https://buscador-comisiones-tg1.vercel.app/'
        }
      });

      const values = response.data.values || [];
      const students = values
        .map((row: string[]) => row[0])
        .filter((name: string) => name && name.trim() && name !== 'Nombre');

      data[color] = { doc: config.doc, count: students.length, students };
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al cargar los datos',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
