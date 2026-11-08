import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorDetail: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorDetail: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorDetail: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Zühre Planet Çekirdek Hatası:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#030014] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background FX */}
          <div className="absolute top-0 w-full h-[500px] bg-red-500/10 blur-[120px] pointer-events-none" />
          
          <div className="z-10 flex flex-col items-center max-w-lg text-center p-8 rounded-3xl bg-black/40 border border-red-500/20 backdrop-blur-xl">
            <AlertOctagon className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            
            <h1 className="text-3xl font-black font-orbitron tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
              SİSTEM ANOMALİSİ
            </h1>
            
            <p className="text-gray-400 mb-8 font-medium leading-relaxed">
              Uzay-zaman sürekliliğinde bir kırılma yaşandı. İlgili modül şu anda çevrimdışı. Lütfen sinyalin tekrar kurulmasını sağlayın.
            </p>

            <button
              onClick={() => window.location.href = '/'}
              className="group flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all hover:border-red-500/50"
            >
              <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
              SİSTEMİ YENİDEN BAŞLAT
            </button>

            {process.env.NODE_ENV === 'development' && this.state.errorDetail && (
              <div className="mt-8 p-4 bg-black/50 rounded-lg text-left w-full overflow-x-auto text-xs text-red-400 font-mono border border-red-900/50">
                {this.state.errorDetail.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
