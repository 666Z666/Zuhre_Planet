import { describe, expect, it } from 'vitest';
import { isPanicShortcutEligible } from '@/lib/panicProtocol';

describe('isPanicShortcutEligible', () => {
  it('düz içerikte kısayola izin verir', () => {
    const target = document.createElement('main');
    expect(isPanicShortcutEligible(target)).toBe(true);
  });

  it.each(['input', 'textarea', 'select', '[contenteditable="true"]', '[role="textbox"]'])('yazı girişi %s içindeyken kısayolu devre dışı bırakır', (selector) => {
    const parent = document.createElement('div');
    parent.innerHTML = `<${selector.startsWith('[') ? 'div' : selector} ${selector.startsWith('[') ? selector.slice(1, -1) : ''}></${selector.startsWith('[') ? 'div' : selector}>`;
    const target = parent.firstElementChild;
    expect(isPanicShortcutEligible(target)).toBe(false);
  });

  it('modal içeriğinde ve IME kompozisyonunda kısayolu devre dışı bırakır', () => {
    const dialog = document.createElement('div');
    dialog.setAttribute('aria-modal', 'true');
    const button = document.createElement('button');
    dialog.append(button);
    expect(isPanicShortcutEligible(button)).toBe(false);
    expect(isPanicShortcutEligible(document.body, true)).toBe(false);
  });
});
