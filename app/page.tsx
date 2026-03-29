'use client';

import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import CommissionsList from './components/CommissionsList';

interface ComisionData {
  [key: string]: { doc: string; count: number; students: string[] };
}

export default function Home() {
  const [data, setData] = useState<ComisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/comisiones');
        if (!response.ok) throw new Error('Error cargando datos');
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStudents = data
    ? Object.values(data).reduce((acc, c) => acc + c.count, 0)
    : 0;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-lg">
      <header className="p-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase font-black text-cyan-400 mb-1">
            FAU - UNNE
          </p>
          <h1 className="text-2xl font-black leading-none mb-1">
            TECNOLOGÍA<br />GRÁFICA 1
          </h1>
          <p className="text-xs opacity-60 font-medium">Ciclo Lectivo 2026 • Comisiones CMYK</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-20">
          <svg width="150" height="150" viewBox="0 0 100 100">
            <circle cx="40" cy="40" r="30" fill="#00ffff" />
            <circle cx="60" cy="40" r="30" fill="#ff00ff" />
            <circle cx="50" cy="65" r="30" fill="#ffff00" />
          </svg>
        </div>
      </header>

      <SearchBar onFilterChange={setFilter} totalStudents={totalStudents} filter={filter} />

      <main className="flex-grow p-4 space-y-8 overflow-y-auto">
        {loading && <div className="text-center py-8 text-gray-500">Cargando datos...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {data && <CommissionsList data={data} filter={filter} />}
      </main>

      <footer className="p-6 bg-gray-50 border-t text-center">
        <div className="flex justify-center gap-4 mb-4">
          {[
            { color: '#00ffff', label: 'CIAN' },
            { color: '#ff00ff', label: 'MAGENTA' },
            { color: '#ffff00', label: 'AMARILLO' },
            { color: '#000000', label: 'NEGRO' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
              <p className="text-[8px] font-bold">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-400 leading-tight uppercase tracking-tighter">
          Este buscador es una herramienta pedagógica de la cátedra.
          <br />
          Los colores representan la síntesis sustractiva de color.
        </p>
      </footer>
    </div>
  );
}
