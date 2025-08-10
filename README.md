# 漫画ギャラリー

このフォルダを GitHub Pages / Netlify / Vercel に置くだけで公開できます。

## 構成
- `index.html` … 本体
- `assets/style.css` … 見た目
- `assets/app.js` … 検索・タグ・モーダルなどの動作
- `images/` … 作品画像（サムネ640px & 拡大1200px 推奨）

## 作品の追加
`index.html` の最下部 `window.WORKS` に作品オブジェクトを追加してください。

```js
{
  id: "my-work",
  title: "作品タイトル",
  year: 2025,
  tags: ["読み切り","シリアス"],
  thumb: "images/my-work_640.jpg",
  thumbWebp: "images/my-work_640.webp",
  full: "images/my-work_1200.jpg",
  fullWebp: "images/my-work_1200.webp",
  alt: "代替テキスト",
  caption: "キャプション",
  link: "https://example.com/works/my-work"
}
```

## 公開（GitHub Pages）
1. GitHub で新規リポジトリ作成（例: `manga-gallery`）
2. このフォルダの中身をアップロード（`Add file` → `Upload files`）
3. `Settings` → `Pages` → **Source: Deploy from a branch**  
   **Branch:** `main` / `/root` を選択 → `Save`
4. 数十秒後、表示された URL にアクセス
