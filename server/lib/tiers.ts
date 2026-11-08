/** Üyelik seviyesi limitleri — tek kaynak (escort.router, media.router ve frontend bunu referans alır). */
export const TIER_LIMITS = {
  free:     { photoLimit: 5,  videoLimit: 0, canBoost: false, visibilityMultiplier: 1.0 },
  gold:     { photoLimit: 15, videoLimit: 2, canBoost: true,  visibilityMultiplier: 1.5 },
  platinum: { photoLimit: 30, videoLimit: 5, canBoost: true,  visibilityMultiplier: 2.0 },
  vip:      { photoLimit: 999, videoLimit: 20, canBoost: true, visibilityMultiplier: 3.0 },
} as const;

export type TierLevel = keyof typeof TIER_LIMITS;
