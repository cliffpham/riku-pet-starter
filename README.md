# Riku Pet Starter

Riku と一緒に育てる、たまごっち風の小さなブラウザゲームです。まずは読みやすい構成にして、Codex と相談しながら機能を足していけるようにしています。

## セットアップ

Node.js 22.12 以降を使ってください。

```bash
npm run dev
```

ブラウザで表示された URL を開くとゲームが動きます。

## よく使うコマンド

```bash
npm run dev      # 開発サーバー
npm run test     # ゲームロジックのテスト
npm run check    # 主要な JS ファイルの構文チェック
```

## フォルダ構成

```text
.
├── docs/              # 一緒に進めるためのメモ
├── public/            # 画像など、そのまま配信するアセット
├── src/
│   ├── game/          # 状態、ルール、保存などのゲームロジック
│   ├── ui/            # DOM の描画
│   ├── main.js        # アプリの起点
│   └── styles.css     # 画面全体のスタイル
├── scripts/           # 開発用の小さな Node スクリプト
├── index.html
└── package.json
```

## GitHub に push する流れ

このディレクトリでは Git 初期化と初回 commit は完了済みです。GitHub 側で空のリポジトリを作ったら、以下を実行します。

```bash
git remote add origin git@github.com:YOUR_NAME/riku-pet-starter.git
git push -u origin main
```

GitHub CLI を使う場合は、以下でも作れます。

```bash
gh repo create riku-pet-starter --private --source=. --remote=origin --push
```

## 次に作るとよさそうなもの

- ペットの名前を画面から変更する
- 成長段階ごとに見た目を変える
- 体調が悪い状態を追加する
- 1 日ごとのログを残す
- テストを増やして、ルール変更に強くする
