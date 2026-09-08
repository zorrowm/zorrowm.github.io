export interface PptFontPackManifest {
  readonly kind: 'flyfish-cjk-font-pack-v1';
  readonly file: 'ppt-font-cjk.otf';
  readonly bytes: number;
  readonly sha256: string;
}

export interface PptPackageManifest {
  readonly kind: 'flyfish-ppt-public-native-wasm-v2';
  readonly product: 'Flyfish PPT Viewer';
  readonly format: 'PowerPoint 97-2003 (.ppt)';
  readonly packageName: '@file-viewer/ppt';
  readonly packageVersion: string;
  readonly engine: 'flyfish-classic-ppt-native-engine';
  readonly engineBuild: string;
  readonly id: 'FV-PPT-PUBLIC-WATERMARKED-V2';
  readonly feature: 'ppt';
  readonly edition: 'public-watermarked';
  readonly holder: 'Individuals and Organizations';
  readonly distribution: 'proprietary-public-binary';
  readonly commercialUse: true;
  readonly publicAnyOrigin: true;
  readonly watermarkRequired: true;
  readonly watermarkText: 'Flyfish Viewer';
  readonly usePolicy: 'public-watermarked-general-use';
  readonly licensePolicy: 'flyfish-public-watermarked-binary-license-v2';
  readonly sourceCodeRights: false;
  readonly sourceDeliveryRights: false;
  readonly apacheLicenseApplies: false;
  readonly redistributionAllowed: true;
  readonly redistributionPolicy: 'unmodified-integrated-bundling-only';
  readonly standaloneRedistributionAllowed: false;
  readonly watermarkRemovalRequiresCommercialAuthorization: true;
  readonly runtimeLicenseRequired: false;
  readonly renderer: 'native-wasm-worker-offscreen-canvas';
  readonly integrity: 'native-wasm-font-sha256-v2';
  readonly wasmFile: 'ppt-native.wasm';
  readonly wasmBytes: number;
  readonly wasmSha256: string;
  readonly workerFile: 'worker.mjs';
  readonly fontPack: PptFontPackManifest;
  readonly workerDefault: true;
  readonly virtualScrollDefault: true;
  readonly frameCache: 'indexeddb-final-watermarked-png-lru';
  readonly watermarkEnforcement: 'native-final-frame';
}

export interface PptRuntimeLicenseSummary {
  readonly id: 'FV-PPT-PUBLIC-WATERMARKED-V2';
  readonly edition: 'public-watermarked';
  readonly holder: 'Individuals and Organizations';
  readonly policy: 'flyfish-public-watermarked-binary-license-v2';
  readonly commercialUse: true;
  readonly sourceCodeRights: false;
  readonly sourceDeliveryRights: false;
  readonly apacheLicenseApplies: false;
  readonly redistributionAllowed: true;
  readonly redistributionPolicy: 'unmodified-integrated-bundling-only';
  readonly standaloneRedistributionAllowed: false;
  readonly watermarkRemovalRequiresCommercialAuthorization: true;
}

export interface PptWatermarkSummary {
  readonly required: true;
  readonly text: 'Flyfish Viewer';
}

export interface PptRenderOptions {
  /** CSS size multiplier. Defaults to 1. */
  scale?: number;
  /** Raster density. Defaults to devicePixelRatio in browsers and 1 elsewhere. */
  pixelRatio?: number;
}

export interface PptMountOptions extends PptRenderOptions {
  /** Replace existing children of the target. Defaults to true. */
  replace?: boolean;
  /** Optional class name for the generated viewer root. */
  className?: string;
  /** Render only the viewport and overscan window. Defaults to true. */
  virtualize?: boolean;
  /** IntersectionObserver root. Defaults to the browser viewport. */
  scrollRoot?: Element | Document | null;
  /** IntersectionObserver overscan. Defaults to `150% 0px`. */
  rootMargin?: string;
  /** Delay before a hidden Canvas is persisted and released. Defaults to 1200 ms. */
  releaseDelayMs?: number;
}

export interface PptFrameCacheOptions {
  enabled?: boolean;
  dbName?: string;
  /** Total IndexedDB frame budget. Defaults to 256 MiB. */
  maxBytes?: number;
  /** Maximum number of cached pages. Defaults to 200. */
  maxEntries?: number;
  /** Maximum encoded PNG size for one page. Defaults to 32 MiB. */
  maxEntryBytes?: number;
}

export interface PptFrameCacheStats {
  readonly enabled: boolean;
  readonly available: boolean;
  readonly disabledReason: string | null;
  readonly entries: number;
  readonly bytes: number;
  readonly maxBytes: number;
  readonly maxEntries: number;
  readonly maxEntryBytes: number;
  readonly hits: number;
  readonly misses: number;
  readonly writes: number;
  readonly nativeRenders: number;
  readonly cancellations: number;
  readonly attachedCanvases: number;
  readonly activeCanvases: number;
  readonly wasmMemoryBytes: number;
}

export interface PptRenderResult {
  readonly cancelled?: boolean;
  readonly slideIndex: number;
  readonly width: number;
  readonly height: number;
  readonly logicalWidth: number;
  readonly logicalHeight: number;
  readonly scale: number;
  readonly pixelRatio: number;
  readonly source?: 'native' | 'indexeddb';
}

export interface PptDocument {
  readonly mode: 'worker' | 'direct';
  readonly documentId: string;
  readonly slideCount: number;
  readonly width: number;
  readonly height: number;
  readonly closed: boolean;
  renderSlide(
    slideIndex: number,
    canvas: HTMLCanvasElement | OffscreenCanvas,
    options?: PptRenderOptions
  ): Promise<PptRenderResult>;
  releaseSlide(slideIndex: number): Promise<boolean>;
  cacheStats(): Promise<PptFrameCacheStats>;
  close(): Promise<void>;
}

export interface MountedPptViewer {
  readonly document: PptDocument;
  readonly root: HTMLElement;
  readonly canvases: readonly HTMLCanvasElement[];
  readonly virtualized: boolean;
  renderSlide(slideIndex: number): Promise<PptRenderResult | void>;
  cacheStats(): Promise<PptFrameCacheStats>;
  close(): Promise<void>;
}

export type PptAssetSource = string | URL | Response | ArrayBuffer | Uint8Array;

export interface LoadPptViewerOptions {
  wasmUrl?: PptAssetSource;
  fontUrl?: PptAssetSource;
  workerUrl?: string | URL;
  /** `auto` uses a module Worker when Worker and OffscreenCanvas are supported. */
  worker?: 'auto' | boolean;
  /** Transfer ownership of full-buffer inputs to the Worker to avoid a main-thread copy. The input becomes detached. */
  transferInputOwnership?: boolean;
  /** Stores only final, native-watermarked PNG frames in bounded IndexedDB. */
  cache?: false | PptFrameCacheOptions;
}

export interface PptViewerRuntime {
  readonly mode: 'worker' | 'direct';
  readonly license: Readonly<PptRuntimeLicenseSummary>;
  readonly watermark: Readonly<PptWatermarkSummary>;
  open(input: ArrayBuffer | Uint8Array): Promise<PptDocument>;
  mount(
    target: string | HTMLElement,
    input: ArrayBuffer | Uint8Array,
    options?: PptMountOptions
  ): Promise<MountedPptViewer>;
  cacheStats(): Promise<PptFrameCacheStats>;
  close(): Promise<void>;
}

export declare function getPptPackageManifest(): PptPackageManifest;
export declare function loadPptViewer(options?: LoadPptViewerOptions): Promise<PptViewerRuntime>;
export declare const createPptViewer: typeof loadPptViewer;
