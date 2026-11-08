/**
 * Ortak anahtarı (numara özeti, fotoğraf özeti) paylaşan farklı profilleri gruplar.
 * Aynı profilin kendi içinde tekrarı (ör. telefon = WhatsApp) sinyal sayılmaz.
 */
export interface SharedGroup {
  profileIds: number[];
}

export function groupShared(rows: { key: string; profileId: number }[]): SharedGroup[] {
  const byKey = new Map<string, Set<number>>();
  for (const r of rows) {
    let set = byKey.get(r.key);
    if (!set) byKey.set(r.key, (set = new Set()));
    set.add(r.profileId);
  }
  // Aynı profil kümesini paylaşan anahtarları birleştir (telefon + WhatsApp aynı iki profilde → tek grup)
  const seen = new Set<string>();
  const groups: SharedGroup[] = [];
  for (const set of byKey.values()) {
    if (set.size < 2) continue;
    const ids = [...set].sort((a, b) => a - b);
    const sig = ids.join(',');
    if (seen.has(sig)) continue;
    seen.add(sig);
    groups.push({ profileIds: ids });
  }
  return groups.sort((a, b) => b.profileIds.length - a.profileIds.length);
}

/** Yüklenen dosya içeriğinin özeti (media.contentHash için). */
export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(data instanceof Uint8Array ? data : new Uint8Array(data)).digest('hex');
}
