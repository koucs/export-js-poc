# Changesets の使い方（このリポジトリ版）

Changesets を使って `packages/*` のバージョン管理と CHANGELOG 生成を行う手順をまとめています。CLI は `@changesets/cli` を利用します。

## セットアップ
1. `npm install -D @changesets/cli` を実行し、ワークスペースに CLI を導入する。
2. `.changeset/config.json` が配置されていることを確認する（このリポジトリでは初期設定済み）。

> 初回に `npx changeset init` を行う場合は `.changeset` 配下に README や config が生成されますが、本リポジトリでは編集済みのファイルをコミットしています。

## 変更内容の記述
`npx changeset` を実行すると対話的に変更対象パッケージとリリース種別（patch/minor/major）を選択できます。終了すると `.changeset/*.md` が作成されます。

- 例: `@poc/lib-basic` と `@poc/lib-dual` を patch 更新する場合
  - 対話でパッケージを選び、サマリーには「math helper を最適化」などの概要を記述。
  - 生成ファイルのイメージは [`sample-change.md`](./sample-change.md) を参照。

## バージョン反映と publish
1. バージョン反映: `npx changeset version`
   - 各パッケージの `package.json` が更新され、CHANGELOG も生成されます（本設定では changelog を無効化しています）。
2. パッケージ配布: `npm run build` 後に `npx changeset publish` で npm へ公開できます。
3. Publish しない場合でも、社内レジストリ等に合わせて `changeset version` まで実行するとバージョン差分をコミットできます。

## このリポジトリ向けの Tips
- `@poc/lib-react` は peerDependencies を持つため、publish 前に peer のバージョン整合を確認してください。
- `packages/lib-dual` は ESM/CJS の二系統を出力するため、リリース前に `npm run build -w lib-dual` で両方のビルドが通るかを確認してください。
- プルリク作成時は `.changeset` のファイルも必ずコミットして、次のバージョン反映に含めるようにしてください。

## `.changeset/config.json` の設定項目
このリポジトリに配置している `config.json` の主なキーと役割をまとめます。

- `$schema`: 設定ファイルのスキーマ URL。エディタでの補完やバリデーションに利用されます。
- `changelog`: `false` のため `changeset version` 実行時に CHANGELOG を生成しません。別ツールでリリースノートを管理する前提の設定です。
- `commit`: `false` のため version 実行後の変更を自動コミットしません。手動コミットで PR ルールを維持します。
- `fixed` / `linked`: 空配列で設定しており、バージョンをまとめて固定・連動させるパッケージグループはありません。
- `access`: `restricted` としており、`changeset publish` で公開されるパッケージのアクセス権を非公開（スコープ付き private 扱い）にします。
- `baseBranch`: `main` を基準ブランチとして release の計算を行います。メインブランチにマージされた changeset がリリース対象です。
- `updateInternalDependencies`: `patch` 指定により、同一ワークスペース内で依存先が patch/minor/major 更新された場合に依存パッケージを自動で patch バンプします。
- `ignore`: 空配列なので全パッケージがリリース対象。特定パッケージを除外したい場合はここに名前を追加します。
