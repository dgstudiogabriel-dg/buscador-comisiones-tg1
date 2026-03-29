'use client';

interface ComisionData {
  [key: string]: { doc: string; count: number; students: string[] };
}

interface CommissionsListProps {
  data: ComisionData;
  filter: string;
}

const getColorClass = (color: string): string => {
  const colorKey = color.toUpperCase();
  const colorMap: { [key: string]: string } = {
    AMARILLA: 'text-yellow-700',
    NEGRO: 'text-black',
    CIAN: 'text-cyan-700',
    MAGENTA: 'text-magenta-700',
  };
  return colorMap[colorKey] || 'text-gray-700';
};

const getCircleColor = (color: string): string => {
  const colorKey = color.toUpperCase();
  const colorMap: { [key: string]: string } = {
    AMARILLA: '#ffff00',
    NEGRO: '#000000',
    CIAN: '#00ffff',
    MAGENTA: '#ff00ff',
  };
  return colorMap[colorKey] || '#ccc';
};

export default function CommissionsList({
  data,
  filter,
}: CommissionsListProps) {
  return (
    <div className="space-y-8 pb-8">
      {Object.entries(data).map(([color, info]) => {
        const filtered = info.students.filter((s) =>
          s.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) return null;

        return (
          <section key={color}>
            <div className="flex items-end justify-between border-b-2 border-gray-100 pb-2 mb-4 sticky top-[108px] bg-white pt-2 z-10">
              <h2 className={`font-black text-2xl tracking-tighter ${getColorClass(color)}`}>
                {color}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Prof. {info.doc}
              </span>
            </div>
            <div className="grid gap-2">
              {filtered.map((name, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-transparent hover:border-gray-200 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCircleColor(color) }}
                  />
                  <span className="font-semibold text-gray-800">{name}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {Object.values(data).every(
        (c) =>
          c.students.filter((s) =>
            s.toLowerCase().includes(filter.toLowerCase())
          ).length === 0
      ) &&
        filter && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron resultados para "{filter}"
          </div>
        )}
    </div>
  );
}
