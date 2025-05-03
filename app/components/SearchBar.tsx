'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row shadow-md rounded-full overflow-hidden">
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-6 py-3 rounded-full sm:rounded-r-none outline-none text-[#4A4A4A]"
          aria-label="Search recipes"
        />
        <div className="flex">
          <button
            type="button"
            className="bg-gray-200 text-gray-400 px-4 cursor-not-allowed"
            aria-label="Voice search (coming soon)"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button
            type="submit"
            className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-6 py-3 sm:rounded-r-full transition duration-200"
            aria-label="Search"
          >
            <span className="hidden sm:inline">Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
} 