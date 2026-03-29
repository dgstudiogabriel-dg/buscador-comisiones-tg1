'use client';

interface SearchBarProps {
  onFilterChange: (filter: string) => void;
  totalStudents: number;
  filter: string;
}

export default function SearchBar({
  onFilterChange,
  totalStudents,
  filter,
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white p-4 border-b border-gray-100 shadow-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Ingresá tu apellido..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-gray-900 focus:bg-white outline-none transition-all text-lg font-medium"
        />
        <svg
          className="absolute left-4 top-4 w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="text-[10px] uppercase font-black text-gray-400 mt-3 tracking-widest px-1 text-center">
        {filter
          ? `Buscando: "${filter}"`
          : `Total: ${totalStudents} alumnos registrados`}
      </div>
    </div>
  );
}
