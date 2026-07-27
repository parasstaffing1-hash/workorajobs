import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// The current PostgreSQL client uses the Node driver. Do not select pg's
// experimental Workerd TCP adapter until the database is migrated to
// Hyperdrive/edge-compatible Prisma.
config.cloudflare = { useWorkerdCondition: false };

export default config;
