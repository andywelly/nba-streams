'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession(); // Get the user session

  return (
    <header className="bg-black">
      <nav className="relative z-10 p-5 flex items-center justify-between">
        {/* Left Side: Basketball Logo, NBA Streams, and Navigation Links */}
        <div className="flex items-center gap-4">
          {/* Basketball Logo and NBA Streams */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/basketball.svg" // Update the path to your basketball image
                alt="Basketball Home Button"
                width={50}
                height={50}
                className="rounded transform hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <Link
              href="/"
              className="text-white text-xl font-bold hover:text-gray-300 transition-colors duration-300"
            >
              NBA Streams
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex gap-4 ml-6">
            <li>
              <Link
                href="/"
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side: Sign In / Sign Out */}
        <div>
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}