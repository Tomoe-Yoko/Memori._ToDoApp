# Memori. - TODOアプリ
[![MemoriTOP画像](https://github.com/user-attachments/assets/15118719-2678-4199-a94e-1d9cbd166ec9)](https://memori-todoapp.vercel.app/)
> **Memori.** は、忙しい人でもタスクの漏れを防ぎ、効率的に、かつ楽しみながら自分の時間も大切にできるようにと開発したTODOアプリです。
---

## URL
https://memori-todoapp.vercel.app/

---

## 開発の目的

このアプリは、次々に浮かぶアイデアやタスクを整理するための「自分専用の場所」が欲しいと感じたことが、開発の原点です。
私自身、日々のタスクを効率よくこなしつつ、ゆったりとした“自分の時間”も大切にしたいと考えてきました。
同じように忙しい毎日を送っている方のタスク整理ツールになればと思い、「Memori.」を開発しました。
世の中には多機能なTODOアプリが数多くありますが、タスクをこなすためだけのツールが多い印象でした。
そこでMemori.では、気分に合わせて変更できる豊富な背景色を設定できるようにし、「自分らしい空間」を感じられるよう工夫しています。
また、ルーティンページでは「ごみの日」などの定期的な予定を登録でき、達成した際にはちょっとした“幸せ”を感じられるような仕様にいたしました。
日々のタスクも楽しくなるような、そんなアプリを目指しています。

---

## 主な機能一覧

- **タスクの整理と効率化**  
  あれもこれもと、やりたいことがたくさんあるユーザーでもタスクを漏らさず、優先順位を明確に保ちながら進められます。

- **パーソナルなカスタマイズ**  
  背景色の変更が15色から選べるなど、「自分らしい」空間を設定可能。

- **ページ構成**
  - ログインページ
  - カレンダーページ
  - TODOリストページ
  - ルーティンページ
  - ギャラリーページ
| ページ構成 | 画像 | 説明 |
|------------|------|------|
| カレンダー | <img src="https://github.com/user-attachments/assets/ec9dbaa3-645d-46ba-98e6-f3ee50024dad" width="200"/> | 簡単なカレンダー。予定ごとに色分けでき、複数人の予定も一目で把握できます。 |
| TODOリスト | <img src="https://github.com/user-attachments/assets/d89d0199-418e-48f9-96c6-6267a81a4560" width="200"/> | タスクをカテゴリー別に整理でき、視認性を高めました。 |
| ルーティン | <img src="https://github.com/user-attachments/assets/add78158-999a-416f-a1f9-18415298fec7" width="200"/> | 毎週の定期タスクを一括管理し、達成感を得られる仕組みを取り入れています。 |
| ギャラリー | <img src="https://github.com/user-attachments/assets/a0c6c8fd-e6ba-4b45-9f07-21c05ef2c11f" width="200"/> | 画像をカテゴリー別に保存でき、プリント類の整理にも活用できます。 |
| セッティング | <img src="https://github.com/user-attachments/assets/77bdae20-9c77-4c3a-89c7-afc5e70e8343" width="200"/> | 背景色のカラーバリエーションが豊富で、お問い合わせも可能です。 |
---

## 使用技術

- **フレームワーク**: Next.js (create-next-appベース)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel
- **フォント最適化**: `next/font` によるGeistの自動最適化
- **ORM**: Prisma
- **その他**
  - supabase
  - tailwindCSS
  - ChatGPTを開発補助ツールとして活用（ロジック理解を重視）

---

##  開発者向け情報

### パッケージインストール

以下のいずれかのコマンドで依存関係をインストール：

```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
