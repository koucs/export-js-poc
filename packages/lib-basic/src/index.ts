// Named exports (tree-shaking しやすい)
export { add, multiply } from './math/index.js';

// Namespace export (名前空間でまとめる)
export * as math from './math/index.js';

// Default export を別サブパスから再公開
export { default as sum } from './sum.js';

