import { NextResponse } from 'next/server';
import { google } from 'googleapis';

interface ComisionData {
  [key: string]: { doc: string; count: number; students: string[] };
}

const SHEET_CONFIG = [
  { key: 'CIAN',    doc: 'Germán',  range: 'cian_german!A1:A1000' },
  { key: 'MAGENTA', doc: 'Gabriel', range: 'magenta_gabriel!A1:A1000' },
  { key: 'AMARILLA',doc: 'Javier',  range: 'amarillo_javier!A1:A1000' },
  { key: 'NEGRO',   doc: 'Kike',    range: 'negro_kike!A1:A1000' },
];

async function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

export async function GET() {
  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
  const data: ComisionData = {};

  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    for (const config of SHEET_CONFIG) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: config.range,
        });

        const rows = response.data.values ?? [];
        const students = rows
          .flat()
          .map((v) => String(v).trim())
          .filter((name) => name.length > 0);

        data[config.key] = { doc: config.doc, count: students.length, students };
      } catch (error) {
        console.error(`Error cargando ${config.key}:`, error);
        data[config.key] = { doc: config.doc, count: 0, students: [] };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error de autenticación:', error);
    return NextResponse.json({ error: 'Error de autenticación con Google Sheets' }, { status: 500 });
  }
}
