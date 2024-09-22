"use server";

import prisma from "@lib/db";
import { updateCompanySchema } from "@/schemas/company.schema";
import type { ServerActionResponse } from "@/types/types";
import { checkAdmin } from "@/permissions";
import { serializeZodError } from "@/lib/utils";
import { UpdateCompanyFormInputs } from "@/schemas/company.schema";
import { revalidatePath } from "next/cache";
import { logAction, logError } from "@/lib/logging";

type UpdateCompanyInputs = {
  companyId: string;
  companyData: UpdateCompanyFormInputs;
};

export async function updateCompany({
  companyId,
  companyData: inputs,
}: UpdateCompanyInputs): Promise<
  ServerActionResponse<UpdateCompanyFormInputs, void>
> {
  // check permissions
  const { session, message } = await checkAdmin();
  if (!session) {
    return {
      success: false,
      message,
    };
  }
  const tenantId = session.user.tenantId;

  // validate inputs
  const validatedInputs = updateCompanySchema.safeParse(inputs);
  if (!validatedInputs.success) {
    return {
      success: false,
      formErrors: serializeZodError(validatedInputs.error),
    };
  }

  // update company
  try {
    await prisma.company.update({
      where: { companyId, tenantId },
      data: {
        ...validatedInputs.data,
      },
    });
    logAction({
      timestamp: new Date(),
      user: session.user,
      type: "update",
      message: `Company updated: ${companyId}`,
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: `Error updating company: ${companyId}`,
    });
    return {
      success: false,
      message: "An error occurred while adding the company",
    };
  }
}
