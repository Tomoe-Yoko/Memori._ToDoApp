// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
//TODOアイテムのソート順を更新するスクリプト
// async function main() {
//   const todoGroups = await prisma.todoGroup.findMany({
//     include: {
//       toDoItems: {
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   for (const group of todoGroups) {
//     for (let i = 0; i < group.toDoItems.length; i++) {
//       const item = group.toDoItems[i];
//       await prisma.todoItems.update({
//         where: { id: item.id },
//         data: { sortOrder: i + 1 },
//       });
//     }
//   }
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error:", e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// ソートタブ順を付与するスクリプト
//コマンド　npx tsx scripts/updateSortOrder.ts
// const main = async () => {
//   try {
//     const todoGroups = await prisma.todoGroup.findMany({
//       orderBy: [{ userId: "asc" }, { createdAt: "asc" }],
//     });

//     const updates = [];

//     let currentUserId: number | null = null;
//     let order = 1;

//     for (const group of todoGroups) {
//       if (group.userId !== currentUserId) {
//         currentUserId = group.userId;
//         order = 1;
//       }

//       updates.push(
//         prisma.todoGroup.update({
//           where: { id: group.id },
//           data: { sortTabOrder: order },
//         })
//       );

//       order++;
//     }

//     await prisma.$transaction(updates);
//     console.log("✅ ユーザーごとに sortTabOrder を付与しました。");
//   } catch (e) {
//     console.error("❌ Error:", e);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// main();
