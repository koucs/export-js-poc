# AGENTS

## 起動手順サマリ
- 前提: Node 18+。パッケージマネージャは npm または pnpm。
- 依存関係インストール
  - pnpm: `pnpm install`
  - npm: `npm install`
- ライブラリをワークスペース全体でビルド
  - pnpm: `pnpm -r --filter ./packages/** run build`
  - npm: `npm -ws --if-present run build`
- デモの実行
  - Node デモ: `npm run start -w demo-node` / `pnpm -C apps/demo-node start`
  - CJS require テスト: `npm run require-test -w demo-node`
  - React デモ (Vite): `npm run dev -w demo-react` / `pnpm -C apps/demo-react dev` に続き http://localhost:5173 へアクセス

このリポジトリで作業する際は上記のセットアップ・実行手順を参照してください。
