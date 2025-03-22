'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams.get('guest') === 'true';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create home URL with guest parameter if needed
  const homeUrl = isGuestMode ? "/home?guest=true" : "/home";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    if (isGuestMode) {
      // If in guest mode, redirect to home with guest parameter
      router.push('/home?guest=true');
    } else {
      signOut();
    }
    setProfileDropdownOpen(false);
  };

  return (
    <header className="bg-black">
      <nav className="relative z-10 p-5 flex items-center justify-between">
        {/* Left Side: Logo, NBA Streams, and Navigation Links */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={28} className="text-white" />
              ) : (
                <Menu size={28} className="text-white" />
              )}
            </button>
          </div>
          {/* Basketball Logo and NBA Streams */}
          <div className="flex items-center gap-4">
            <Link href={homeUrl}>
              <Image
                src="/basketball.svg"
                alt="Basketball Home Button"
                width={50}
                height={50}
                className="rounded transform hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <Link
              href={homeUrl}
              className="text-white text-xl font-bold hover:text-gray-300 transition-colors duration-300"
            >
              NBA Streams
            </Link>
          </div>
          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex gap-4 ml-6">
            <li>
              <Link
                href={homeUrl}
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={isGuestMode ? "/about?guest=true" : "/about"}
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href={isGuestMode ? "/contact?guest=true" : "/contact"}
                className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* Right Side: Profile Icon or Sign In */}
        <div className="relative" ref={dropdownRef}>
          {session || isGuestMode ? (
            <div>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white p-3 rounded-full transition-all duration-300"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                aria-label="User profile menu"
              >
                <User size={20} />
              </button>
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg overflow-hidden z-20">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 rounded-full p-2">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {isGuestMode ? "Guest" : session?.user?.name || "User"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {isGuestMode ? (
                      <Link 
                        href="/login" 
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--accent-color)] transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Login
                      </Link>
                    ) : (
                      <>
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-white hover:bg-[var(--accent-color)] transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--accent-color)] transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
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
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              href={homeUrl}
              className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={isGuestMode ? "/about?guest=true" : "/about"}
              className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href={isGuestMode ? "/contact?guest=true" : "/contact"}
              className="text-white hover:bg-[var(--accent-color)] hover:border-4 border-dashed hover:border-white px-6 py-2 rounded transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}