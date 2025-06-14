import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const todoGroups = await prisma.todoGroup.findMany({
    include: {
      toDoItems: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  for (const group of todoGroups) {
    console.log(`Updating todoGroupId: ${group.id}`);

    for (let i = 0; i < group.toDoItems.length; i++) {
      const item = group.toDoItems[i];
      await prisma.todoItems.update({
        where: { id: item.id },
        data: { sortOrder: i + 1 },
      });
    }
  }

  console.log("✅ All sortOrders have been updated.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
