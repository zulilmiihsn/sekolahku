"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, FileText, CheckCircle } from 'lucide-react'
import MasukHalaman from '../../components/masukHalaman'

export default function Pendaftaran() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    telepon: '',
    alamat: '',
    tanggalLahir: '',
    asalSekolah: '',
    namaOrangTua: '',
    teleponOrangTua: '',
    pekerjaanOrangTua: '',
    alamatOrangTua: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulasi pengiriman data
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <MasukHalaman>
        <main className="max-w-2xl mx-auto py-24 px-4 min-h-screen flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Pendaftaran Berhasil!</h1>
            <p className="text-gray-600 mb-6">
              Terima kasih telah mendaftar di Sekolah Modern. Tim kami akan segera menghubungi Anda untuk proses selanjutnya.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Langkah Selanjutnya:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tim kami akan menghubungi Anda dalam 1-2 hari kerja</li>
                <li>• Siapkan dokumen yang diperlukan</li>
                <li>• Lakukan tes masuk sesuai jadwal yang diberikan</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  namaLengkap: '',
                  email: '',
                  telepon: '',
                  alamat: '',
                  tanggalLahir: '',
                  asalSekolah: '',
                  namaOrangTua: '',
                  teleponOrangTua: '',
                  pekerjaanOrangTua: '',
                  alamatOrangTua: ''
                })
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Daftar Lagi
            </button>
          </motion.div>
        </main>
      </MasukHalaman>
    )
  }

  return (
    <MasukHalaman>
      <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-primary mb-4">Pendaftaran Siswa Baru</h1>
          <p className="text-gray-600 text-lg">Tahun Ajaran 2024/2025</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/90 rounded-2xl shadow-lg p-8 space-y-8"
        >
          {/* Data Siswa */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <User className="w-6 h-6" />
              Data Siswa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contoh@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asal Sekolah</label>
                <input
                  type="text"
                  name="asalSekolah"
                  value={formData.asalSekolah}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nama sekolah sebelumnya"
                />
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <User className="w-6 h-6" />
              Data Orang Tua/Wali
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Orang Tua/Wali *</label>
                <input
                  type="text"
                  name="namaOrangTua"
                  value={formData.namaOrangTua}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nama lengkap orang tua/wali"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon Orang Tua *</label>
                <input
                  type="tel"
                  name="teleponOrangTua"
                  value={formData.teleponOrangTua}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan Orang Tua</label>
                <input
                  type="text"
                  name="pekerjaanOrangTua"
                  value={formData.pekerjaanOrangTua}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Pekerjaan orang tua/wali"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Orang Tua</label>
                <textarea
                  name="alamatOrangTua"
                  value={formData.alamatOrangTua}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Alamat orang tua/wali"
                />
              </div>
            </div>
          </div>

          {/* Informasi Pendaftaran */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi Pendaftaran
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Pendaftaran dibuka mulai 1 Januari - 31 Maret 2024</li>
              <li>• Tes masuk akan dilaksanakan pada bulan April 2024</li>
              <li>• Pengumuman hasil tes masuk pada bulan Mei 2024</li>
              <li>• Daftar ulang pada bulan Juni 2024</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mengirim Pendaftaran...
              </>
            ) : (
              <>
                <GraduationCap className="w-5 h-5" />
                Daftar Sekarang
              </>
            )}
          </button>
        </motion.form>
      </main>
    </MasukHalaman>
  )
} 