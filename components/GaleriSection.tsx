"use client";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import NoPhotoPlaceholder from "./NoPhotoPlaceholder";
import { createPortal } from "react-dom";

export default function GaleriSection() {
  const [galeri, setGaleri] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    fetch("/api/galeri")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setGaleri(data);
        } else {
          console.error('Data galeri bukan array:', data);
          setGaleri([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching galeri:', err);
        setError(err.message);
        setGaleri([]);
        setLoading(false);
      });
  }, []);

  // Logic grid/slider
  const perPage = 4;
  const total = galeri.length;
  const maxSlide = total > 0 ? Math.ceil(total / perPage) - 1 : 0;
  const start = slideIdx * perPage;
  const end = start + perPage;
  const current = galeri.slice(start, end);

  // Lightbox handler
  const openLightbox = (idx: number) => {
    setLightboxIdx(start + idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevLightbox = () => setLightboxIdx(idx => (idx === 0 ? galeri.length - 1 : idx - 1));
  const nextLightbox = () => setLightboxIdx(idx => (idx === galeri.length - 1 ? 0 : idx + 1));

  if (loading) {
    return <div className="text-center py-16">Memuat galeri...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white/70 rounded-2xl shadow-lg border border-white/60 min-h-[200px]">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <ImageIcon className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 text-center text-lg font-medium">Error memuat galeri</p>
        <p className="text-text/60 text-center text-sm mt-2">{error}</p>
      </div>
    );
  }

  // Belum ada gambar sama sekali
  if (!galeri.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white/70 rounded-2xl shadow-lg border border-white/60 min-h-[200px]">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary/10 via-accent/10 to-blue-100 mb-4">
          <ImageIcon className="w-8 h-8 text-accent" />
        </div>
        <p className="text-text/70 text-center text-lg font-medium">Belum ada foto yang diupload</p>
      </div>
    );
  }

  // Jika gambar < 4, isi sisa slot dengan placeholder kotak
  let items: (string | null)[] = [];
  if (total < perPage) {
    items = [...galeri, ...Array(perPage - total).fill(null)];
  } else {
    items = current;
    if (current.length < perPage) {
      items = [...current, ...Array(perPage - current.length).fill(null)];
    }
  }

  return (
    <div className="relative py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((url, i) =>
          url ? (
            <button
              key={url}
              className="rounded-lg overflow-hidden shadow border bg-white focus:outline-none"
              onClick={() => openLightbox(i)}
              tabIndex={0}
            >
              <Image src={url} alt={`Galeri ${start + i + 1}`} width={400} height={192} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover w-full h-48 transition hover:scale-105" />
            </button>
          ) : (
            <NoPhotoPlaceholder key={i} className="h-48" />
          )
        )}
      </div>
      {/* Slider control */}
      {total > perPage && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="p-2 rounded-full bg-white border shadow hover:bg-accent/10 disabled:opacity-40"
            onClick={() => setSlideIdx(idx => (idx === 0 ? maxSlide : idx - 1))}
            disabled={maxSlide === 0}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="p-2 rounded-full bg-white border shadow hover:bg-accent/10 disabled:opacity-40"
            onClick={() => setSlideIdx(idx => (idx === maxSlide ? 0 : idx + 1))}
            disabled={maxSlide === 0}
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
      {/* Lightbox pakai portal */}
      {lightboxOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-3xl w-full flex flex-col items-center">
            <button className="absolute top-4 right-4 text-xl text-primary hover:text-accent" onClick={closeLightbox}>
              <X className="w-7 h-7" />
            </button>
            <div className="flex items-center justify-center w-full h-[60vh]">
              <button
                className="p-2 rounded-full bg-white/80 border shadow hover:bg-accent/10 mr-4"
                onClick={prevLightbox}
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <Image
                src={galeri[lightboxIdx]}
                alt={`Galeri ${lightboxIdx + 1}`}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 90vw, 1200px"
                className="object-contain max-h-[55vh] max-w-[60vw] rounded-lg"
              />
              <button
                className="p-2 rounded-full bg-white/80 border shadow hover:bg-accent/10 ml-4"
                onClick={nextLightbox}
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
            <div className="mt-2 text-sm text-text/60">Foto {lightboxIdx + 1} dari {galeri.length}</div>
          </div>
        </div>,
        typeof window !== "undefined" ? document.body : document.createElement("div")
      )}
    </div>
  );
} 