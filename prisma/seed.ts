import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("1234", 12);
  const user = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      passwordHash: hash,
      wallet: { create: { balance: 500 } },
    },
  });

  await Promise.all([
    prisma.board.upsert({ where: { name: "职场八卦" }, update: {}, create: { name: "职场八卦", description: "办公室那些事儿", sortOrder: 1 } }),
    prisma.board.upsert({ where: { name: "情感八卦" }, update: {}, create: { name: "情感八卦", description: "恋爱、分手、相亲...", sortOrder: 2 } }),
    prisma.board.upsert({ where: { name: "吃瓜专区" }, update: {}, create: { name: "吃瓜专区", description: "娱乐、热点、大瓜小瓜一起吃", sortOrder: 3 } }),
    prisma.board.upsert({ where: { name: "闲聊灌水" }, update: {}, create: { name: "闲聊灌水", description: "想说啥说啥", sortOrder: 4 } }),
  ]);

  console.log("Seed complete: user=demo/1234, boards=4");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
