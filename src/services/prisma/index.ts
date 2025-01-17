import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async update({ args, query  }) {
        const oldData = await prisma.user.findFirst({ where: args.where });
        const result = await query(args);
        const newData = await prisma.user.findFirst({ where: args.where });
        console.log({ oldData, newData, result });
        return result;
      }
    },
  },
});

export default prisma;
