---
id: repost-sentinel
name: 転載見張り
version: 0.1.0
author: hitalin
description: 自分の投稿画像を SauceNao で定期照会し、他サイトへの無断転載の可能性を検知して知らせる
mode: heartbeat
scope: per-account
category: analysis
triggers: []
tags: [artist, repost, saucenao, watch]
---

# 転載見張り

自分が Misskey に投稿した画像を SauceNao で逆検索し、**pixiv / X / Danbooru など他サイトに同じ画像が出現していないか**を定期的に見張る HEARTBEAT スキル。絵師が「知らないうちに転載されていた」に早く気づくためのもの。saucenao-search プラグイン (出典を探す) の逆方向で、**自分の作品が出典**である前提で複製を探す。

## 前提条件

- Secret Vault に SauceNao 接続が登録されていること (saucenao-search プラグインと同じ接続を共有できる):
  - 接続名: `SauceNao` / baseUrl: `https://saucenao.com`
  - 認証タイプ: クエリパラメータ (パラメータ名: `api_key`)
  - AI からの利用を許可していること (`<available-connections>` に出ていなければ使えない)
- **照会時に画像 URL が SauceNao に送信される**。これを望まないユーザーはこのスキルを使うべきではない。初回セットアップで必ず伝える

## 状態管理 (メモ)

NoteDeck のメモを 1 枚だけ使う。タイトル: `転載見張り: 設定と状態`

```
## 自分の公開先 (転載ではない場所)
- pixiv: <ユーザー ID または URL>
- X/Twitter: <ユーザー名>
- (その他)

## 状態
- lastCheckedAt: <ISO 日時 — この日時より新しいノートを次回チェックする>
- 保留: <レート制限で未チェックのまま残った件数など>
```

## 初回セットアップ (メモが無いとき)

SauceNao は呼ばず、ユーザーに以下を聞いて上記メモを作って終わる:

1. 自分が **公式に作品を公開しているサイトとアカウント** (pixiv, X, Danbooru に自分で投稿しているか等)。ここに載っている場所は検知しても転載扱いしない
2. 画像 URL が SauceNao に送信されることへの同意
3. `lastCheckedAt` は「いま」で初期化 (過去分を遡りたいと言われたら指定日時にする)

## 手順 (2 回目以降の HEARTBEAT)

1. メモから設定と `lastCheckedAt` を読む
2. `notes.user` で自分のノートを取得し、`lastCheckedAt` より新しい **画像付き・自作投稿** を古い順に集める
   - リノート・他人の画像の引用は除外。ファイルの `type` が `image/*` のものだけ
3. 各画像について `vault.fetch` で SauceNao に照会:
   - `connectionRef: "SauceNao"` / `method: GET`
   - `path: /search.php?output_type=2&numres=5&url={画像 URL を URL エンコード}`
4. 1 枚照会するごとに `lastCheckedAt` をそのノートの `createdAt` に進めてメモを更新する (途中でレート制限に当たっても進捗が失われない)
5. 判定 (下記) を集計してレポートする

## レート制限 (厳守)

- SauceNao 無料枠は **4 回 / 30 秒・100 回 / 日**。応答 JSON の `header.short_remaining` / `header.long_remaining` を毎回確認する
- `short_remaining` が 0 になったら、または **1 回の HEARTBEAT で 4 枚** 照会したら、そこで打ち切って残りは次回に回す (lastCheckedAt が途中まで進んでいるので続きから再開される)
- `long_remaining` が 10 を切ったら照会をやめ、「本日の照会枠が残りわずか」と 1 行報告する
- HTTP 429 や `header.status != 0` はエラーとして 1 行報告し、lastCheckedAt を進めずに終わる

## 判定

各照会結果の `results[]` について `header.similarity` (文字列なので数値化) を見る:

| 類似度 | 扱い |
| --- | --- |
| 90% 以上 | 一致とみなす |
| 80–90% | 参考情報 (加工・トリミングされた転載の可能性) |
| 80% 未満 | 無視 (別作品・偶然の類似) |

一致したものは `data.ext_urls` / `data.member_name` / `data.author_name` 等を **メモの「自分の公開先」と突き合わせる**:

- 自分のアカウントに載っているだけ → 正常 (クロスポストが index されただけ)。報告不要
- 自分の公開先に **含まれない** サイト・アカウント → **転載候補** として報告

## 出力フォーマット

異常なし (照会した全画像が正常):

```
✓ 転載見張り: 新しい画像 {N} 枚を照会 — 転載候補はありませんでした (本日の残り枠 {long_remaining})
```

新しい画像が 0 枚なら「新しい画像はありません」の 1 行のみ。

転載候補があるとき:

```
## ⚠ 転載見張り: 転載の可能性 {N} 件

### {ノートの日時} の画像
- 元ノート: {ノート URL}
- 発見場所: {ext_url} (類似度 {similarity}%, 投稿者: {member_name})
- 自分の公開先リストに含まれていません

### 対応の選択肢
- 発見場所を開いて実物を確認する (最優先 — 誤検知があり得ます)
- 自分の公開先だった場合はメモの「自分の公開先」に追記してください
```

## 制約と注意

- **断定しない**。「転載されています」ではなく「転載の可能性」。SauceNao の index 反映遅れ、コラボ・寄稿・公式転載など正当なケースは判別できない
- **通報や削除依頼を代行しない・促しすぎない**。事実の提示と確認先の URL までがこのスキルの仕事。対応は必ず人間が判断する
- CW 付き・公開範囲がホーム以下のノートの画像も照会対象にしてよいが、レポートに画像そのものは展開しない (URL とノートへのリンクだけ)
- SauceNao が index しているのは pixiv / X / Danbooru 系など一部のサイトだけ。「候補なし」=「転載されていない」ではないことを、月に 1 度程度はレポート末尾で思い出させる
- 接続が `<available-connections>` に無い・Vault 未設定のときは、SauceNao 接続の登録手順 (前提条件の内容) を案内して終わる
