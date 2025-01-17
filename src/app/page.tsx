"use client";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import top01 from "@/app/public/img/top01.png";
import top02 from "@/app/public/img/top02.png";
import top03 from "@/app/public/img/top03.png";
import top04 from "@/app/public/img/top04.png";
import Button from "./_components/Button";
import Footer from "./_components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <section className="py-28">
          <Image
            src={memo}
            alt="topImage"
            width={100}
            height={200}
            className="m-auto"
          />
          <h2 className="text-white text-5xl text-center py-8">Memori.</h2>
          <p className="text-center text-text_button py-4">
            自分の予定はもちろん
            <br />
            大切な人の予定もまとめて管理
            <br /> 忙しい日常をスムーズにするToDoアプリ
          </p>
          <div className="my-12">
            <Link href="/login">
              <Button text="ログイン" />
            </Link>
          </div>

          <Link href="/signup">
            <Button text="新規登録" />
          </Link>
        </section>
        <section className="py-28">
          <h2 className="text-white text-4xl text-center py-8">
            01．Calendar.
          </h2>
          <Image src={top01} alt="calendar" className="m-auto" />
          <p className="w-72 mx-auto text-text_button py-4">
            シンプルなカレンダー。
            <br />
            家族のスケジュールを色分けして一目でわかるように。
          </p>
        </section>
        <section className="py-28">
          <h2 className="text-white text-4xl text-center py-8">02．Todo.</h2>
          <Image src={top02} alt="todo" className="m-auto" />
          <p className="w-72 mx-auto text-text_button py-4">
            買うものリストで買い忘れなし。
            <br />
            簡単にリスト化して効率よくこなす。
          </p>
        </section>
        <section className="py-28">
          <h2 className="text-white text-4xl text-center py-8">03．Gallery.</h2>
          <Image src={top03} alt="gallery" className="m-auto" />
          <p className="w-72 mx-auto text-text_button py-4">
            子供が持ち帰るプリントは、画像で残しておけば外出先でも確認できちゃう。
          </p>
        </section>
        <section className="py-28">
          <h2 className="text-white text-4xl text-center py-8">
            04．Routine work.
          </h2>
          <Image src={top04} alt="routinework" className="m-auto" />
          <p className="w-72 mx-auto text-text_button py-4">
            曜日ごとのルーティンワークを記録。 <br />
            ごみの日や、観たいテレビだって記録しておけば逃さない。
          </p>
        </section>

        <section className="py-28 bg-[#fffa]">
          <p className="w-72 mx-auto text-text_button py-4 text-lg">
            忙しいあなたへ <br /> 毎日おつかれさま。 <br />
            効率良くタスクをこなして ゆっくりできる時間を 確保してくださいね。
          </p>
          <div className="mt-12">
            <Link href="/signup">
              <Button text="使ってみる！" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
