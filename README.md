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

- **ページ構成と機能**
 <markdown-accessiblity-table data-catalyst=""><table>
<thead>
<tr>
<th>カレンダー</th>
<th>TODOリスト</th>
</tr>
</thead>
<tbody>
<tr>
<td><img src="https://github.com/user-attachments/assets/aa35909a-3b6d-4ed9-98f2-6968447fc444" alt="image" style="max-width: 100%;"></td>
<td><img src="https://github.com/user-attachments/assets/1c3cc392-dee1-452d-8722-6881ec32653e" alt="image" style="max-width: 100%;"></td>
</tr>
<tr>
<td>簡単なカレンダー。予定ごとに色分けでき、複数人の予定も一目で把握できます。</td>
<td>タスクをカテゴリー別に整理でき、視認性を高めました。</td>
</tr>
</tbody>
</table></markdown-accessiblity-table>

<markdown-accessiblity-table data-catalyst=""><table>
<thead>
<tr>
<th>ルーティン</th>
<th>ギャラリー</th>
</tr>
</thead>
<tbody>
<tr>
<td><img src="https://github.com/user-attachments/assets/f2d8cbe4-3f33-46ab-9047-d761ccafc6c4" alt="image" style="max-width: 100%;"></td>
<td><img src="https://github.com/user-attachments/assets/5ee2532a-e051-4e9c-8312-749dedfbfd42" alt="image" style="max-width: 100%;"></td>

</tr>
<tr>
<td>毎週の定期タスクを一括管理し、達成感を得られる仕組みを取り入れています。</td>
<td>画像をカテゴリー別に保存でき、プリント類の整理にも活用できます。</td>
</tr>
</tbody>
</table></markdown-accessiblity-table>

<markdown-accessiblity-table data-catalyst=""><table>
<thead>
<tr>
<th>セッティング</th>

</tr>
</thead>
<tbody>
<tr>
<td><img src="https://github.com/user-attachments/assets/7878a6b7-38db-458d-a8cb-33ab7c447150" alt="image" style="max-width: 100%;"></td>
</tr>
<tr>
<td>背景色のカラーバリエーションが豊富で、お問い合わせも可能です。</td>
</tr>
</tbody>
</table></markdown-accessiblity-table>
---

## 機能・使用技術
![機能の表](https://github.com/user-attachments/assets/db0d6961-6d16-41d9-a251-4a1194f69721)

- **フレームワーク**: Next.js (create-next-appベース)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel
- **ORM**: Prisma
- **その他**
  - supabase
  - tailwindCSS
  - ChatGPTを開発補助ツールとして活用（ロジック理解を重視）

---

## ER図
![機能の表](https://github.com/user-attachments/assets/0c5a174b-db52-4310-9cf1-77e4af66dd4a)

---
##　今後
今後は、現在の機能改善によるユーザー体験の向上に加え、新たな機能の追加やUI/UXの強化を進めていきます。
また、リファクタリングやデバッグも並行して行い、システム全体のパフォーマンスを最適化することで、より快適な利用環境の提供に努めます。

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
