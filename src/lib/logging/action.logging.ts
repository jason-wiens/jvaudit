import { User } from "next-auth/types";

type LogActionInputs = {
  timestamp: Date;
  user: User;
  type: "add" | "update" | "delete";
  message: string;
};

export function logAction({ timestamp, user, message, type }: LogActionInputs) {
  console.log(`-------- Action ---------------`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Tenant: ${user.tenantId}`);
  console.log(`User: ${user.email}`);
  console.log();
  console.log(`Type: ${type}`);
  console.log(`Message: ${message}`);
  console.log(`-------- End Action -----------`);
}
