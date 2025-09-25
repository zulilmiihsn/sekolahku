"use client";
import { useEffect, useState } from "react";
import { School, MapPin, Mail, Phone, ArrowUpRight, Instagram, Facebook, Youtube, Settings } from 'lucide-react'
import Link from 'next/link'
import { clientFetchSiteName } from '../app/utils/api'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/guru', label: 'Guru & Staff' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/berita', label: 'Berita' },
  { href: '/ekstrakurikuler', label: 'Ekstrakurikuler' },
  { href: '/tanya-jawab', label: 'Tanya Jawab' },
]

const socialLinks = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Youtube, label: 'YouTube' },
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
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {siteName}
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              Membangun generasi unggul melalui pendidikan berkualitas dengan fasilitas modern dan tenaga pengajar profesional.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Navigasi</h3>
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-600 hover:text-primary transition-colors duration-200 group"
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 leading-relaxed">
                  {kontak.alamat || 'Alamat belum diatur'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href={`mailto:${kontak.email}`} 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {kontak.email || 'Email belum diatur'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href={`tel:${kontak.telepon}`} 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {kontak.telepon || 'Telepon belum diatur'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </div>
            
            {/* Admin Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200 group"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 