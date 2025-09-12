"use client";
import { useEffect, useState } from "react";
import { School, MapPin, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { clientFetchSiteName } from '../app/utils/api'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/guru', label: 'Guru' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/berita', label: 'Berita' },
  { href: '/tanya-jawab', label: 'Tanya Jawab' },
  { href: '/pendaftaran', label: 'Pendaftaran' },
]

export default function Footer() {
  const [kontak, setKontak] = useState({ alamat: "", email: "", telepon: "" });
  const [siteName, setSiteName] = useState('Sekolah Modern');

  useEffect(() => {
    fetch("/api/pengaturan/kontak")
      .then((res) => res.json())
      .then((data) => setKontak(data));
    
    clientFetchSiteName().then(setSiteName);
  }, []);

  return (
    <footer className="bg-white border-t border-white/40 text-sm text-text/70">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Logo & Nama */}
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <School className="text-primary w-7 h-7" />
          <span className="font-bold text-lg text-primary">{siteName}</span>
        </div>
        {/* Navigasi kecil */}
        <nav className="flex gap-6 flex-wrap">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Alamat & Kontak */}
        <div className="text-xs text-right md:text-left space-y-1">
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <MapPin className="w-4 h-4 text-accent" />
            {kontak.alamat || 'Alamat belum diatur'}
          </div>
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <Mail className="w-4 h-4 text-accent" />
            <a href={`mailto:${kontak.email}`} className="hover:underline">{kontak.email || 'Email belum diatur'}</a>
          </div>
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <Phone className="w-4 h-4 text-accent" />
            <a href={`tel:${kontak.telepon}`} className="hover:underline">{kontak.telepon || 'Telepon belum diatur'}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/30 py-4 text-center text-xs text-text/50">
        © {new Date().getFullYear()} Zul Ilmi Ihsan. All rights reserved.
      </div>
    </footer>
  );
} 