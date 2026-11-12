/**
 * Test Setup File
 *
 * Global test configuration and imports.
 * Runs before each test file.
 *
 * @module tests/setup
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

type ConsoleErrorArgs = Parameters<typeof console.error>;

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill for PointerEvent
interface PointerEventInit extends EventInit {
  pointerId?: number;
  width?: number;
  height?: number;
  pressure?: number;
  tangentialPressure?: number;
  tiltX?: number;
  tiltY?: number;
  twist?: number;
  pointerType?: string;
  isPrimary?: boolean;
}

global.PointerEvent = class PointerEvent extends Event implements PointerEvent {
  pointerId: number;
  width: number;
  height: number;
  pressure: number;
  tangentialPressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  pointerType: string;
  isPrimary: boolean;

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.pointerId = props.pointerId ?? 0;
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
    this.pressure = props.pressure ?? 0;
    this.tangentialPressure = props.tangentialPressure ?? 0;
    this.tiltX = props.tiltX ?? 0;
    this.tiltY = props.tiltY ?? 0;
    this.twist = props.twist ?? 0;
    this.pointerType = props.pointerType ?? '';
    this.isPrimary = props.isPrimary ?? false;
  }
} as unknown as typeof PointerEvent;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock window.location
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
    assign: () => undefined,
    reload: () => undefined,
    replace: () => undefined,

  } as unknown as Location,
});

// Mock scrollTo
window.scrollTo = () => {};

// Polyfill Storage / localStorage / sessionStorage for Node 22+ where native localStorage may be undefined without --localstorage-file
const ensureWebStorage = (name: 'localStorage' | 'sessionStorage') => {
  const existing = Object.getOwnPropertyDescriptor(window, name)?.value;
  if (existing && typeof existing.getItem === 'function' && typeof existing.setItem === 'function' && typeof existing.clear === 'function') {
    return;
  }

  const store = new Map<string, string>();
  const storageInstance = Object.create(Storage.prototype) as Storage;

  Storage.prototype.getItem = function (this: Storage, key: string): string | null {
    const map = (this as unknown as { __store?: Map<string, string> }).__store ?? store;
    return map.has(String(key)) ? (map.get(String(key)) ?? null) : null;
  };
  Storage.prototype.setItem = function (this: Storage, key: string, value: string): void {
    const map = (this as unknown as { __store?: Map<string, string> }).__store ?? store;
    map.set(String(key), String(value));
  };
  Storage.prototype.removeItem = function (this: Storage, key: string): void {
    const map = (this as unknown as { __store?: Map<string, string> }).__store ?? store;
    map.delete(String(key));
  };
  Storage.prototype.clear = function (this: Storage): void {
    const map = (this as unknown as { __store?: Map<string, string> }).__store ?? store;
    map.clear();
  };
  Storage.prototype.key = function (this: Storage, index: number): string | null {
    const map = (this as unknown as { __store?: Map<string, string> }).__store ?? store;
    return Array.from(map.keys())[index] ?? null;
  };

  Object.defineProperty(storageInstance, '__store', {
    value: store,
    enumerable: false,
    writable: false,
  });

  Object.defineProperty(storageInstance, 'length', {
    get: () => store.size,
    configurable: true,
  });

  Object.defineProperty(window, name, {
    value: storageInstance,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, name, {
    value: storageInstance,
    configurable: true,
    writable: true,
  });
};

ensureWebStorage('localStorage');
ensureWebStorage('sessionStorage');

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: ConsoleErrorArgs) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
