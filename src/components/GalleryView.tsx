import React, { useState } from "react";
import { GALLERY_ITEMS } from "../coursesData";
import { Eye, Image as ImageIcon, X } from "lucide-react";

export default function GalleryView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const categories = ["All", "Electrical Lab", "Mobile Repair", "Electronics Lab", "AC Workshop", "Plumbing", "Student Activities"];

  const filteredItems = selectedCategory === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-semibold">Campus Tour</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">Our Institute Gallery</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans text-sm">
          Explore our actual training workshops, machinery, electrical panels, diagnostic equipment, and certificate graduation events.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2.5 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full font-sans text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "bg-white border border-gray-100 text-gray-600 hover:text-gray-950 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer relative h-64"
          >
            {/* Image container */}
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Blur Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <div className="bg-white/95 text-slate-900 p-2.5 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Eye className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Floating details banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white">
              <span className="text-[9px] font-mono font-semibold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                {item.category}
              </span>
              <p className="font-sans text-xs font-medium mt-1.5 truncate text-gray-100 leading-tight">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-gray-50 rounded-2xl border border-gray-100 max-w-lg mx-auto">
          <ImageIcon className="h-10 w-10 text-gray-300 mx-auto" />
          <h3 className="font-display font-semibold text-gray-700">No Workshop Photos Yet</h3>
          <p className="text-gray-400 font-sans text-xs">We will add photos for this workshop category very soon.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div 
            className="relative bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Large Image */}
            <div className="aspect-video w-full relative">
              <img 
                src={activePhoto.image} 
                alt={activePhoto.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Details Footer */}
            <div className="p-6 text-white space-y-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-500 text-slate-900 px-2.5 py-1 rounded font-bold">
                {activePhoto.category}
              </span>
              <h3 className="font-display font-semibold text-lg sm:text-xl text-gray-100">
                {activePhoto.title}
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Demonstrated during standard practical workshops under direct mentorship of OTTC engineering trade masters.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
