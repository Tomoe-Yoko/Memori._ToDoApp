import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateContactRequestBody } from "@/app/_type/Contact";
import { supabase } from "@/utils/supabase";
import fetch from "node-fetch";
const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({
    where: { supabaseUserId },
  });

  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  try {
    const body: CreateContactRequestBody = await request.json();
    const { userName, email, text } = body;

    const contactData = await prisma.contact.create({
      data: {
        userId: user.id, // サーバー側で設定
        userName,
        email,
        text,
      },
    });
    console.log("37test");

    // Slackに通知を送信
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error(
        "Slack Webhook URL is not defined in environment variables"
      );
    }
    console.log("46test");

    const slackMessage = {
      text: `新しいお問い合わせがありました。\n\n名前: ${userName}\nメール: ${email}\n内容: ${text}`,
    };
    console.log("51test");

    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });
    console.log("60test");

    return NextResponse.json({
      status: "OK",
      message: "Contact entry created and Slack notification sent successfully",
      id: contactData.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    throw error; // 必要に応じてエラーを再スロー
  }
};
