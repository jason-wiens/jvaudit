import { User } from "next-auth/types";

type LogErrorInputs = {
  id: string;
  timestamp: Date;
  user?: User;
  message: string;
  error: any;
};

export function logError({
  id,
  timestamp,
  user,
  message,
  error,
}: LogErrorInputs) {
  console.log(`-------- Error ---------------`);
  console.log(`ID: ${id}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Tenant: ${user?.tenantId || "Unknown"}`);
  console.log(`User: ${user?.email || "Unknown"}`);
  console.log();
  console.log(`Message: ${message}`);
  console.log("Error:");
  console.error(error);
  console.log(`-------- End Error -----------`);
}
