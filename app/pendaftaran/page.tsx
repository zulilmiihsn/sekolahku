"use client"

import Navbar from '../../components/Navbar'
import { motion } from 'framer-motion'
import PageEnter from '../../components/PageEnter'

export default function Pendaftaran() {
  return (
    <PageEnter>
      <Navbar />
      <main className="max-w-md mx-auto py-24 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Pendaftaran Siswa Baru</h1>
        <form className="bg-white/80 rounded-2xl shadow-lg p-8 grid gap-5">
          <input type="text" placeholder="Nama Lengkap" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" />
          <input type="email" placeholder="Email" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" />
          <input type="text" placeholder="Asal Sekolah" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" />
          <button type="submit" className="mt-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200">Daftar Sekarang</button>
        </form>
      </main>
    </PageEnter>
  )
} 