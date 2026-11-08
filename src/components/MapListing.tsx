/**
 * Map Listing Component
 * 
 * Escorts profillerini interaktif bir harita üzerinde gösteren bileşen.
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ListingProfile } from '@/types/domain';
import { motion } from 'framer-motion';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

// Custom Neon Icon Factory
const createNeonIcon = (tier: string, isLive: boolean) => {
  const color = isLive ? '#d4af37' : (tier === 'diamond' || tier === 'elite' || tier === 'vip' ? '#a855f7' : '#3fae86');
  const size = isLive ? 48 : 36;
  
  return L.divIcon({
    className: 'custom-neon-marker',
    html: `
      <div class="relative flex items-center justify-center p-2" style="width: ${size}px; height: ${size}px;">
        ${isLive ? `<div class="absolute inset-0 bg-primary/40 rounded-full animate-ping opacity-40"></div>` : ''}
        <div style="
          width: 100%;
          height: 100%;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          z-index: 10;
        ">
          <div style="width: 80%; height: 80%; background: #000; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

interface MapListingProps {
  profiles: ListingProfile[];
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapListing({
  profiles,
  center = [41.0082, 28.9784],
  zoom = 12,
}: MapListingProps) {
  return (
    <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative z-0">
      <style>{`
        /* Glassmorphism Popup Styles */
        .neon-popup .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 15, 0.9) !important;
          backdrop-filter: blur(25px) saturate(180%) !important;
          border: 1px solid rgba(212, 175, 55, 0.4) !important;
          border-radius: 2.5rem !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 1) !important;
        }

        .neon-popup .leaflet-popup-tip {
          background: rgba(10, 10, 15, 0.9) !important;
          border: 1px solid rgba(212, 175, 55, 0.4) !important;
        }

        .neon-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 250px !important;
        }

        .custom-neon-marker {
          animation: cosmic-birth 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes cosmic-birth {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }
      `}</style>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#05050a' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={center} zoom={zoom} />

        {profiles.map((profile) => {
          const lat = profile.coordinates?.lat || center[0] + (Math.random() - 0.5) * 0.1;
          const lng = profile.coordinates?.lng || center[1] + (Math.random() - 0.5) * 0.1;

          return (
            <Marker
              key={profile.id}
              position={[lat, lng]}
              icon={createNeonIcon(profile.membershipTier, !!profile.isLive)}
            >
              <Popup className="neon-popup">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                      <img src={profile.coverImage} className="w-full h-full object-cover" alt={profile.displayName} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase italic text-shadow-premium leading-tight">{profile.displayName} 💎</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-[10px] font-black text-white/80">{profile.rating}</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">• {profile.district}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest italic text-shadow-premium">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{profile.city} / {profile.district}</span>
                    </div>
                    
                    <Link href={`/listing/${profile.id}`}>
                      <button className="w-full py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 group shadow-xl shadow-primary/30 hover:scale-105 transition-all italic text-shadow-premium">
                        PROFİLİ GÖR 💎
                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-6 right-6 z-10 space-y-2">
         <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,1)]">
           <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic text-shadow-premium">COSMIC RADAR</span>
              <span className="text-xs font-black text-white italic uppercase tracking-tighter text-shadow-premium">NEBULA SCAN: AKTİF</span>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_15px_#d4af37] animate-pulse" />
               <span className="text-[10px] font-black uppercase text-white/80 tracking-[0.1em] italic leading-none text-shadow-premium">CANLI YÖRÜNGEDE</span>
             </div>
             <div className="flex items-center gap-4">
               <div className="w-3.5 h-3.5 bg-gold-500 rounded-full shadow-[0_0_12px_#a855f7]" />
               <span className="text-[10px] font-black uppercase text-white/80 tracking-[0.1em] italic leading-none text-shadow-premium">VIP ELITE</span>
             </div>
             <div className="flex items-center gap-4">
               <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_12px_#3fae86]" />
               <span className="text-[10px] font-black uppercase text-white/80 tracking-[0.1em] italic leading-none text-shadow-premium">KEŞİF MODU</span>
             </div>
           </div>
         </div>

         {/* Mini Summary Tooltip */}
         <div className="px-6 py-3 bg-primary/20 backdrop-blur-xl rounded-2xl border border-primary/40 flex items-center gap-4 shadow-xl">
            <Star className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic text-shadow-premium">{profiles.filter(p => !!p.isLive).length} YILDIZ CANLI</span>
         </div>
      </div>
    </div>
  );
}
