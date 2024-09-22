import { PrismaClient, WorkspaceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const tenantData = {
  fullLegalName: "Integrity Technology Services",
  shortName: "ITS",
  address: "127 Dalcastle Close NW",
  billingInfo: {
    contactName: "Jason Wiens",
    instructions: "Its free for me",
  },
};

const workspaceData = {
  type: WorkspaceType.OUTGOING,
  name: "App Admin",
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

const employeeData = {
  primaryContact: true,
  position: "Super User",
};

const userData = {
  username: "jasonwiens",
  password: "",
  admin: true,
  superUser: true,
  forcePasswordChange: false,
};

async function main() {
  await prisma.$transaction(async (prisma) => {
    const tenant = await prisma.tenant.create({
      data: {
        ...tenantData,
      },
    });

    const workspace = await prisma.workspace.create({
      data: {
        ...workspaceData,
        tenantDefault: true,
        tenant: {
          connect: {
            tenantId: tenant.tenantId,
          },
        },
      },
    });

    const company = await prisma.company.create({
      data: {
        companyId: tenant.tenantId,
        ...companyData,
        tenant: {
          connect: {
            tenantId: tenant.tenantId,
          },
        },
      },
    });

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        defaultWorkspace: {
          connect: {
            workspaceId: workspace.workspaceId,
          },
        },
        profile: {
          create: {
            ...employeeData,
            employerProfile: {
              connect: {
                companyId: company.companyId,
              },
            },
            tenant: {
              connect: {
                tenantId: tenant.tenantId,
              },
            },
            personalProfile: {
              create: {
                ...personData,
                tenant: {
                  connect: {
                    tenantId: tenant.tenantId,
                  },
                },
              },
            },
          },
        },
        tenant: {
          connect: {
            tenantId: tenant.tenantId,
          },
        },
      },
    });
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
