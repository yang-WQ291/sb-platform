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

  const product1 = await prisma.product.create({
    data: {
      sellerId: user.id,
      title: "高等数学 第七版 同济大学",
      description: "九成新，几乎没用过，里面笔记很少。考研必备教材。",
      price: 30,
      category: "书籍",
      images: JSON.stringify([]),
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sellerId: user.id,
      title: "机械键盘 Cherry MX 红轴",
      description: "使用半年，手感很好，红轴适合打字和游戏。包装齐全。",
      price: 150,
      category: "数码",
      images: JSON.stringify([]),
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sellerId: user.id,
      title: "台灯 LED 护眼",
      description: "三档调光，可折叠，宿舍神器。毕业出清。",
      price: 25,
      category: "生活",
      images: JSON.stringify([]),
    },
  });

  console.log(`Seed: products created: ${product1.title}, ${product2.title}, ${product3.title}`);

  console.log("Seed complete: user=demo/1234, boards=4, products=3");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
