# misstore

Misskey / NoteDeck 向けのプラグイン・テーマ・ウィジェットストア。

AiScript プラグインや Misskey 互換テーマ、NoteDeck ウィジェットテンプレートをブラウザから検索・プレビュー・ワンクリックでインストールできます。

## 機能

- **プラグインストア** - AiScript プラグインの検索・カテゴリフィルタ・ソースコピー
- **テーマストア** - ダーク / ライトテーマの検索・カラープレビュー・ソースコピー
- **ウィジェットストア** - NoteDeck の AiScript App ウィジェットテンプレートの検索・カテゴリフィルタ・ソースコピー
- **レジストリ API** - 静的 JSON による配信。外部クライアントからも利用可能

## Tech Stack

- Vue 3 + TypeScript + Vite
- pnpm

## セットアップ

```bash
pnpm install
pnpm run dev
```

## スクリプト

| コマンド | 説明 |
|---------|------|
| `pnpm run dev` | 開発サーバー起動 |
| `pnpm run build` | 型チェック + プロダクションビルド |
| `pnpm run preview` | ビルド結果のプレビュー |
| `pnpm run registry:build` | レジストリインデックスの再生成 |
| `pnpm run typecheck` | 型チェックのみ |

## レジストリ構造

プラグイン・テーマ・ウィジェットは `public/registry/` 以下にディレクトリ単位で管理されます。

```
public/registry/
  plugins/
    <plugin-id>/
      meta.json      # メタデータ
      plugin.is      # AiScript ソースコード
  themes/
    <theme-id>/
      meta.json      # メタデータ
      theme.json5    # テーマ定義
  widgets/
    <widget-id>/
      meta.json      # メタデータ
      widget.is      # AiScript ソースコード
  plugins.json       # 自動生成されるプラグインインデックス
  themes.json        # 自動生成されるテーマインデックス
  widgets.json       # 自動生成されるウィジェットインデックス
```

`plugins.json` / `themes.json` / `widgets.json` は `pnpm run registry:build` で各ディレクトリの `meta.json` から自動生成されます。

### エントリの URL フィールド

- `sourceUrl` — 生ソース（`plugin.is` / `theme.json5` / `widget.is`）。クライアントが実体を取得する際はこちらを使う
- `apiUrl` — `{ type: "plugin" | "theme" | "widget", data: <source> }` を返す Misskey 互換エンドポイント（`api.json`）。`plugin` / `theme` は Misskey 本家の `install-extensions?url=...` で利用される。`widget` は現時点で消費者がいないが、将来 Misskey 本家や他クライアントがウィジェット配信をサポートした時のために同じ流儀で予約されている

## プラグインの追加方法

1. `public/registry/plugins/<id>/` ディレクトリを作成
2. `meta.json` を追加:

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "author": "@you",
  "description": "プラグインの説明",
  "category": "utility",
  "tags": ["tag1", "tag2"]
}
```

3. `plugin.is` に AiScript ソースコードを配置
4. `pnpm run registry:build` でインデックスを再生成

**プラグインカテゴリ:** `post-form` / `note-action` / `user-action` / `note-filter` / `post-filter` / `utility`

## テーマの追加方法

1. `public/registry/themes/<id>/` ディレクトリを作成
2. `meta.json` を追加:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "author": "@you",
  "description": "テーマの説明",
  "base": "dark",
  "tags": ["dark", "cool"],
  "previewColors": {
    "bg": "#1a1a2e",
    "fg": "#eaeaea",
    "panel": "#16213e",
    "accent": "#e94560"
  }
}
```

3. `theme.json5`（または `theme.json`）にテーマ定義を配置
4. `pnpm run registry:build` でインデックスを再生成

## ウィジェットの追加方法

1. `public/registry/widgets/<id>/` ディレクトリを作成
2. `meta.json` を追加:

```json
{
  "id": "my-widget",
  "name": "My Widget",
  "version": "1.0.0",
  "author": "@you",
  "description": "ウィジェットの説明",
  "icon": "ti-box",
  "autoRun": true,
  "category": "display",
  "tags": ["tag1", "tag2"]
}
```

3. `widget.is` に AiScript ソースコードを配置
4. `pnpm run registry:build` でインデックスを再生成

**ウィジェットカテゴリ:** `display` / `input` / `stats`

- `icon` は [Tabler Icons](https://tabler.io/icons) のクラス名（`ti-` プレフィックス付き）
- `autoRun` はユーザーが NoteDeck 側でテンプレートを選択したときに自動実行するか

## ライセンス

MIT
