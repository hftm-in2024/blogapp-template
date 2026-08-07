// Polyfill localStorage for jsdom (used by the theme toggle in App)
if (typeof globalThis.localStorage === 'undefined') {
  // ponytail: kein echter Store — die Tests prüfen kein Persistieren
  globalThis.localStorage = { getItem: () => null, setItem: () => undefined } as unknown as Storage;
}

// Polyfill matchMedia for jsdom (used by the theme toggle in App)
if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = ((query: string) =>
    ({
      matches: false,
      media: query,
      // addListener/removeListener: vom Angular CDK BreakpointObserver benötigt
      addListener: () => undefined,
      removeListener: () => undefined,
    }) as unknown as MediaQueryList) as typeof globalThis.matchMedia;
}

// Polyfill IntersectionObserver for jsdom (used by Angular's @defer on viewport)
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds = [0];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unobserve() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof globalThis.IntersectionObserver;
}
