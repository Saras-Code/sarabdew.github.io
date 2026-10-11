declare module 'page-flip' {
  export class PageFlip {
    constructor(el: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: HTMLElement[]): void;
    on(event: 'flip' | 'changeState' | 'init' | 'update', cb: (e: { data: unknown }) => void): this;
    flip(page: number): void;
    flipNext(): void;
    flipPrev(): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    destroy(): void;
  }
}
