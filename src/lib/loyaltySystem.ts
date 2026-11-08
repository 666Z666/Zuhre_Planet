/**
 * Loyalty & Rank System
 *
 * Defines ranks, XP thresholds, perks, and helper utilities
 * for both escort and customer loyalty programs.
 *
 * Ranks (ascending):
 *   Bronz → Gümüş → Altın → Platin → Elmas → Galaktik
 */

export type LoyaltyRank =
    | 'Bronz'
    | 'Gümüş'
    | 'Altın'
    | 'Platin'
    | 'Elmas'
    | 'Galaktik';

export interface RankConfig {
    name: LoyaltyRank;
    /** Minimum XP required to hold this rank */
    minXP: number;
    /** Max XP of this tier (exclusive) */
    maxXP: number;
    /** Emoji / icon for quick display */
    icon: string;
    /** Tailwind gradient classes for card/badge */
    gradient: string;
    /** Border color (Tailwind class) */
    border: string;
    /** Text colour (Tailwind class) */
    text: string;
    /** VIP / Boost discount percentage for escorts */
    discountPercent: number;
    /** Brief description shown in profile */
    description: string;
}

export const RANK_CONFIG: RankConfig[] = [
    {
        name: 'Bronz',
        minXP: 0,
        maxXP: 500,
        icon: '🥉',
        gradient: 'from-amber-700 to-amber-500',
        border: 'border-amber-600/40',
        text: 'text-amber-400',
        discountPercent: 0,
        description: 'Yeni üye. Puan kazanmaya başla!',
    },
    {
        name: 'Gümüş',
        minXP: 500,
        maxXP: 1500,
        icon: '🥈',
        gradient: 'from-slate-400 to-slate-300',
        border: 'border-slate-400/40',
        text: 'text-slate-300',
        discountPercent: 5,
        description: 'Düzenli kullanıcı. %5 indirim kazandın.',
    },
    {
        name: 'Altın',
        minXP: 1500,
        maxXP: 4000,
        icon: '🥇',
        gradient: 'from-gold-500 to-gold-300',
        border: 'border-gold-500/40',
        text: 'text-gold-400',
        discountPercent: 10,
        description: 'Güvenilir üye. %10 indirim aktif.',
    },
    {
        name: 'Platin',
        minXP: 4000,
        maxXP: 10000,
        icon: '💎',
        gradient: 'from-emerald-500 to-blue-500',
        border: 'border-emerald-400/40',
        text: 'text-emerald-300',
        discountPercent: 15,
        description: 'Elit üye. Öncelikli destek + %15 indirim.',
    },
    {
        name: 'Elmas',
        minXP: 10000,
        maxXP: 25000,
        icon: '✨',
        gradient: 'from-gold-500 to-pink-500',
        border: 'border-gold-400/40',
        text: 'text-gold-300',
        discountPercent: 20,
        description: 'Üst düzey üye. %20 indirim + özel rozet.',
    },
    {
        name: 'Galaktik',
        minXP: 25000,
        maxXP: Infinity,
        icon: '🌌',
        gradient: 'from-primary via-gold-600 to-pink-600',
        border: 'border-primary/50',
        text: 'text-primary',
        discountPercent: 25,
        description: 'Zühre\'nin efsanesi. Maksimum ayrıcalıklar.',
    },
];

/** Returns the RankConfig for a given XP amount */
export function getRankByXP(xp: number): RankConfig {
    for (let i = RANK_CONFIG.length - 1; i >= 0; i--) {
        if (xp >= RANK_CONFIG[i].minXP) return RANK_CONFIG[i];
    }
    return RANK_CONFIG[0];
}

/** Returns progress percentage within current rank (0–100) */
export function getRankProgress(xp: number): number {
    const rank = getRankByXP(xp);
    if (rank.maxXP === Infinity) return 100;
    const rangeSize = rank.maxXP - rank.minXP;
    const progress = xp - rank.minXP;
    return Math.min(100, Math.round((progress / rangeSize) * 100));
}

/** XP earned for various actions */
export const XP_REWARDS = {
    register: 50,
    firstBooking: 100,
    completeBooking: 50,
    leaveReview: 30,
    profileVerified: 100, // Escort only
    dailyLogin: 10,
    referFriend: 200,
} as const;

/** Loyalty point conversion: 100 puan = 1 TL indirim */
export const POINTS_PER_TL = 100;
