import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const tenantData = {
  name: "dev",
};

const companyData = {
  fullLegalName: "Integrity Audit & Accounting Inc.",
  shortName: "IAA",
  address: "123 Main St",
};

const personData = {
  firstName: "Jason",
  lastName: "Wiens",
  email: "jwiens@integrity-audit.com",
};

const userData = {
  username: "jasonwiens",
  password: "password",
  role: ["USER", "ADMIN", "SUPER_USER"],
};

async function main() {
  const tenant = await prisma.tenant.create({ data: tenantData });

  const company = await prisma.company.create({
    data: {
      ...companyData,
      tenant: {
        connect: {
          tenantId: tenant.tenantId,
        },
      },
    },
  });

  const person = await prisma.person.create({
    data: {
      ...personData,
      tenant: {
        connect: {
          tenantId: tenant.tenantId,
        },
      },
      employeeOf: {
        connect: {
          companyId: company.companyId,
        },
      },
    },
  });

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userData,
      role: ["USER", "ADMIN", "SUPER_USER"],
      password: hashedPassword,
      profile: {
        connect: {
          personId: person.personId,
        },
      },
      tenant: {
        connect: {
          tenantId: tenant.tenantId,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
