/**
 * useLoyalty Hook
 * 
 * Sadakat sistemi için tRPC bağlantısı.
 * Puan durumu, rütbe, referral kodu sorgulama ve puan ekleme işlemleri.
 */

import { trpc } from '@/lib/trpc';

export function useLoyaltyStatus() {
  return trpc.loyalty.getMyStatus.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 dakika cache
    retry: 1,
  });
}

export function useLoyaltyLeaderboard(limit = 10) {
  return trpc.loyalty.getLeaderboard.useQuery({ limit }, {
    staleTime: 1000 * 60 * 10, // 10 dakika cache
  });
}

export function useAddPoints() {
  const utils = trpc.useUtils();
  return trpc.loyalty.addPoints.useMutation({
    onSuccess: () => {
      // Puan eklendikten sonra status'u yenile
      utils.loyalty.getMyStatus.invalidate();
    },
  });
}

export function useGenerateReferralCode() {
  const utils = trpc.useUtils();
  return trpc.loyalty.generateReferralCode.useMutation({
    onSuccess: () => {
      utils.loyalty.getMyStatus.invalidate();
    },
  });
}

export function useApplyReferralCode() {
  const utils = trpc.useUtils();
  return trpc.loyalty.applyReferralCode.useMutation({
    onSuccess: () => {
      utils.loyalty.getMyStatus.invalidate();
    },
  });
}

export function useEscortTierInfo() {
  return trpc.escort.getMyTierInfo.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useActivateBoost() {
  const utils = trpc.useUtils();
  return trpc.escort.activateBoost.useMutation({
    onSuccess: () => {
      utils.escort.getMyTierInfo.invalidate();
    },
  });
}
