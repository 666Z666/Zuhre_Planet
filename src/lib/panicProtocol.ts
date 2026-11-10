export function isPanicShortcutEligible(target: EventTarget | null, isComposing = false): boolean {
  if (isComposing) return false;
  if (!(target instanceof Element)) return true;
  return !target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [aria-modal="true"], dialog[open]'
  );
}
