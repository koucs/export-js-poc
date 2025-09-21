## export-js-poc

js/ts ライブラリからの module export（関数や React UI コンポーネント）の代表的な手法を、小さなパッケージ群とデモで比較できる PoC です。

### 構成
- `packages/lib-basic` — ESM/TS。named export、default export、barrel/namespace、subpath exports を実演。
- `packages/lib-dual` — ESM + CJS の dual package。`exports` 条件分岐で `import` と `require` を両立。
- `packages/lib-react` — React コンポーネントを peerDependencies で公開。サブパス `@poc/lib-react/react` を提供。
- `apps/demo-node` — Node で import/require を試すデモ。
- `apps/demo-react` — Vite + React で UI コンポーネントの import を試すデモ。

### 使い方（セットアップ）
前提: Node 18+。パッケージマネージャは npm か pnpm を想定。

1) 依存関係をインストール
- pnpm: `pnpm install`
- npm: `npm install`

2) ライブラリをビルド（workspaces 全体）
- pnpm: `pnpm -r --filter ./packages/** run build`
- npm: `npm -ws --if-present run build`

### デモの試し方
- Node (ESM + CJS)
  - `npm run start -w demo-node`（または `pnpm -C apps/demo-node start`）
  - `npm run require-test -w demo-node`（CJS `require` 動作を確認）

- React (Vite)
  - `npm run dev -w demo-react`（または `pnpm -C apps/demo-react dev`）
  - ブラウザ: http://localhost:5173

---

## 実装したエクスポート手法とサンプル

### 1) Named export（barrel 再公開）
- 例: `packages/lib-basic/src/index.ts`
  - `export { add, multiply } from './math'`
- 使い方: `import { add } from '@poc/lib-basic'`

### 2) Namespace export（名前空間で束ねる）
- 例: `export * as math from './math'`
- 使い方: `import { math } from '@poc/lib-basic'; math.multiply(2,3)`

### 3) Default export（別サブパスで公開）
- 例: `packages/lib-basic/src/sum.ts` を `exports: { "./sum": ... }` で公開
- 使い方: `import sum from '@poc/lib-basic/sum'`

### 4) Subpath exports（パッケージ内の論理エントリ分割）
- 例: `packages/lib-basic/package.json` の `exports: { ".": {...}, "./math": {...}, "./sum": {...} }`
- 使い方: `import { add } from '@poc/lib-basic/math'`

### 5) Dual package（ESM + CJS 条件分岐）
- 例: `packages/lib-dual/package.json` の `exports` で `import`/`require` を切替
- 使い方: 
  - ESM: `import { shout } from '@poc/lib-dual'`
  - CJS: `const dual = require('@poc/lib-dual'); dual.shout('hi')`

### 6) React コンポーネント公開（peerDependencies + subpath）
- 例: `packages/lib-react`（`peerDependencies: react, react-dom`）
- 使い方:
  - ルート: `import { Button } from '@poc/lib-react'`
  - サブパス: `import { Button } from '@poc/lib-react/react'`

---

## Pros / Cons（要点）

### Named export（推奨の基本形）
- Pros
  - ツリーシェイキングに強い/意図が明確
  - API サーフェスが自明でドキュメンテーションしやすい
- Cons
  - 破壊的変更（リネーム）の影響が広い

### Default export（1件を主役として公開）
- Pros
  - 単機能エントリで ergonomics が良い（自由に別名 import）
- Cons
  - named に比べエクスポート一覧が見えにくい
  - CJS/ESM 変換で `default` 周りが混乱しやすい

### Namespace export（名前空間）
- Pros
  - 機能群を論理的に束ねられる（`math.*` など）
- Cons
  - ツリーシェイキング効率は bundler 依存（全体取り込みに注意）

### Barrel 再公開（index で集約）
- Pros
  - 入口を 1 本化できる／内部構造を隠蔽
- Cons
  - 循環参照の温床になりやすい／見落としがち

### Subpath exports（`package.json#exports`）
- Pros
  - エントリ分割・後方互換の維持・内部構造の固定化
- Cons
  - bundler/IDE の解決に依存（設定不整合で解決失敗の恐れ）

### Dual package（ESM + CJS）
- Pros
  - 旧来の `require` と新しい `import` の両対応
- Cons
  - ビルドが二重化し運用コスト増／型解決の複雑化

### React + peerDependencies
- Pros
  - ライブラリ側で React を重複バンドルしない
- Cons
  - 利用側の React バージョン要件に制約がかかる

---

## デモで確認できること
- Node ESM: `@poc/lib-basic` の named・namespace・subpath default を import
- Node CJS: `@poc/lib-dual` を `require` で読み、`default` の扱いを確認
- Vite + React: `@poc/lib-react` をルート/サブパスの両経路で import して描画

### 実行ログ（例）
```
$ npm run start -w demo-node
--- demo-node (ESM) ---
add(2, 3) = 5
math.multiply(2, 3) = 6
sum(1, 2, 3) = 6
shout("hello") = HELLO

$ npm run require-test -w demo-node
--- demo-node (CJS require) ---
dual.shout("hi") = HI
dual.default("x", 5, "0") = 0000x
```

---

## よくある落とし穴とヒント
- `Module not found: Package subpath` エラー: `exports` の定義にそのサブパスが含まれているか確認。
- ツリーシェイキング: `sideEffects: false` を安易に付けると副作用コードが消える恐れ。該当ファイルを除外指定する。
- CJS/ESM の混在: `require()` で ESM を直接読むと失敗。dual package の `require` エントリを使う。
- 型解決: TS の `moduleResolution` を `Node`/`Bundler` いずれかに揃える。IDE とビルドの整合を取る。

---

## 参照ソース（主な場所）
- 基本: `packages/lib-basic/src/*`、`packages/lib-basic/package.json#exports`
- Dual: `packages/lib-dual/package.json#exports`、`tsconfig.esm.json / tsconfig.cjs.json`
- React: `packages/lib-react/src/react/*`、`packages/lib-react/package.json#peerDependencies`
- デモ: `apps/demo-node/*`、`apps/demo-react/*`

