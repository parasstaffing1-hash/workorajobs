CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE "BillingSubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'VOID', 'UNCOLLECTIBLE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'NURTURING', 'WON', 'LOST');
CREATE TYPE "SalesStage" AS ENUM ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');
CREATE TYPE "CrmActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK', 'STATUS_CHANGE');
CREATE TYPE "MediaAssetType" AS ENUM ('RESUME', 'PROFILE_IMAGE', 'COMPANY_LOGO', 'DOCUMENT', 'CERTIFICATE', 'CONTENT_IMAGE');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "CommunicationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP');
CREATE TYPE "DeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'DELIVERED', 'READ');
CREATE TYPE "ExportStatus" AS ENUM ('QUEUED', 'READY', 'FAILED');
CREATE TYPE "SystemSettingType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');
CREATE TYPE "FeatureFlagEnvironment" AS ENUM ('GLOBAL', 'DEVELOPMENT', 'STAGING', 'PRODUCTION');

CREATE TABLE "platform_roles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "system" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_permissions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_role_permissions" (
  "roleId" UUID NOT NULL,
  "permissionId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_role_permissions_pkey" PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE "platform_role_assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "roleId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_role_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "system_settings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "type" "SystemSettingType" NOT NULL DEFAULT 'JSON',
  "description" TEXT,
  "sensitive" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "feature_flags" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "environment" "FeatureFlagEnvironment" NOT NULL DEFAULT 'GLOBAL',
  "rolloutPercentage" INTEGER NOT NULL DEFAULT 0,
  "conditions" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content_pages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "body" TEXT NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "authorId" UUID,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_pages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "media_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "MediaAssetType" NOT NULL,
  "key" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "uploadedById" UUID,
  "companyId" UUID,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_leads" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ownerId" UUID,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "source" TEXT,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "value" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_leads_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_clients" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID,
  "ownerId" UUID,
  "name" TEXT NOT NULL,
  "industry" TEXT,
  "website" TEXT,
  "billingEmail" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_clients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_contacts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "clientId" UUID NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "title" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sales_opportunities" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "clientId" UUID NOT NULL,
  "ownerId" UUID,
  "name" TEXT NOT NULL,
  "stage" "SalesStage" NOT NULL DEFAULT 'PROSPECTING',
  "value" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "closeDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sales_opportunities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_notes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "authorId" UUID,
  "leadId" UUID,
  "clientId" UUID,
  "contactId" UUID,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_tasks" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ownerId" UUID,
  "leadId" UUID,
  "clientId" UUID,
  "contactId" UUID,
  "title" TEXT NOT NULL,
  "dueAt" TIMESTAMP(3),
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_activities" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "actorId" UUID,
  "leadId" UUID,
  "clientId" UUID,
  "contactId" UUID,
  "opportunityId" UUID,
  "type" "CrmActivityType" NOT NULL,
  "title" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analytics_reports" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "filters" JSONB,
  "summary" JSONB NOT NULL,
  "createdById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "analytics_reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "csv_exports" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "status" "ExportStatus" NOT NULL DEFAULT 'QUEUED',
  "filename" TEXT,
  "url" TEXT,
  "filters" JSONB,
  "createdById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "csv_exports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscription_plans" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "interval" "BillingInterval" NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "stripePriceId" TEXT,
  "features" JSONB,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "billing_subscriptions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "planId" UUID NOT NULL,
  "status" "BillingSubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "gstNumber" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "billing_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invoices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "subscriptionId" UUID,
  "number" TEXT NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  "subtotalCents" INTEGER NOT NULL,
  "taxCents" INTEGER NOT NULL DEFAULT 0,
  "totalCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "gstNumber" TEXT,
  "stripeInvoiceId" TEXT,
  "dueAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "invoiceId" UUID,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "provider" TEXT NOT NULL DEFAULT 'stripe',
  "providerPaymentId" TEXT,
  "receiptUrl" TEXT,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "coupons" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL,
  "description" TEXT,
  "percentOff" INTEGER,
  "amountOffCents" INTEGER,
  "currency" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "expiresAt" TIMESTAMP(3),
  "stripeCouponId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "communication_providers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "channel" "CommunicationChannel" NOT NULL,
  "name" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "config" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "communication_providers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notification_deliveries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "notificationId" UUID,
  "channel" "CommunicationChannel" NOT NULL,
  "recipient" TEXT NOT NULL,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'QUEUED',
  "provider" TEXT,
  "payload" JSONB,
  "error" TEXT,
  "sentAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "search_index_documents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "entity" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "keywords" TEXT[] NOT NULL,
  "url" TEXT,
  "weight" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "search_index_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_roles_key_key" ON "platform_roles"("key");
CREATE UNIQUE INDEX "platform_permissions_key_key" ON "platform_permissions"("key");
CREATE INDEX "platform_permissions_resource_action_idx" ON "platform_permissions"("resource", "action");
CREATE INDEX "platform_role_permissions_permissionId_idx" ON "platform_role_permissions"("permissionId");
CREATE UNIQUE INDEX "platform_role_assignments_userId_roleId_key" ON "platform_role_assignments"("userId", "roleId");
CREATE INDEX "platform_role_assignments_roleId_idx" ON "platform_role_assignments"("roleId");
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");
CREATE UNIQUE INDEX "feature_flags_key_environment_key" ON "feature_flags"("key", "environment");
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags"("enabled");
CREATE UNIQUE INDEX "content_pages_slug_key" ON "content_pages"("slug");
CREATE INDEX "content_pages_status_idx" ON "content_pages"("status");
CREATE INDEX "content_pages_authorId_idx" ON "content_pages"("authorId");
CREATE UNIQUE INDEX "media_assets_key_key" ON "media_assets"("key");
CREATE INDEX "media_assets_type_idx" ON "media_assets"("type");
CREATE INDEX "media_assets_uploadedById_idx" ON "media_assets"("uploadedById");
CREATE INDEX "media_assets_companyId_idx" ON "media_assets"("companyId");
CREATE INDEX "crm_leads_ownerId_idx" ON "crm_leads"("ownerId");
CREATE INDEX "crm_leads_status_idx" ON "crm_leads"("status");
CREATE INDEX "crm_leads_email_idx" ON "crm_leads"("email");
CREATE INDEX "crm_clients_companyId_idx" ON "crm_clients"("companyId");
CREATE INDEX "crm_clients_ownerId_idx" ON "crm_clients"("ownerId");
CREATE INDEX "crm_clients_status_idx" ON "crm_clients"("status");
CREATE INDEX "crm_contacts_clientId_idx" ON "crm_contacts"("clientId");
CREATE INDEX "crm_contacts_email_idx" ON "crm_contacts"("email");
CREATE INDEX "sales_opportunities_clientId_idx" ON "sales_opportunities"("clientId");
CREATE INDEX "sales_opportunities_ownerId_idx" ON "sales_opportunities"("ownerId");
CREATE INDEX "sales_opportunities_stage_idx" ON "sales_opportunities"("stage");
CREATE INDEX "crm_notes_authorId_idx" ON "crm_notes"("authorId");
CREATE INDEX "crm_notes_leadId_idx" ON "crm_notes"("leadId");
CREATE INDEX "crm_notes_clientId_idx" ON "crm_notes"("clientId");
CREATE INDEX "crm_notes_contactId_idx" ON "crm_notes"("contactId");
CREATE INDEX "crm_tasks_ownerId_idx" ON "crm_tasks"("ownerId");
CREATE INDEX "crm_tasks_leadId_idx" ON "crm_tasks"("leadId");
CREATE INDEX "crm_tasks_clientId_idx" ON "crm_tasks"("clientId");
CREATE INDEX "crm_tasks_contactId_idx" ON "crm_tasks"("contactId");
CREATE INDEX "crm_tasks_status_idx" ON "crm_tasks"("status");
CREATE INDEX "crm_activities_actorId_idx" ON "crm_activities"("actorId");
CREATE INDEX "crm_activities_leadId_idx" ON "crm_activities"("leadId");
CREATE INDEX "crm_activities_clientId_idx" ON "crm_activities"("clientId");
CREATE INDEX "crm_activities_contactId_idx" ON "crm_activities"("contactId");
CREATE INDEX "crm_activities_opportunityId_idx" ON "crm_activities"("opportunityId");
CREATE INDEX "crm_activities_type_idx" ON "crm_activities"("type");
CREATE INDEX "analytics_reports_type_idx" ON "analytics_reports"("type");
CREATE INDEX "analytics_reports_createdById_idx" ON "analytics_reports"("createdById");
CREATE INDEX "csv_exports_type_idx" ON "csv_exports"("type");
CREATE INDEX "csv_exports_status_idx" ON "csv_exports"("status");
CREATE INDEX "csv_exports_createdById_idx" ON "csv_exports"("createdById");
CREATE UNIQUE INDEX "subscription_plans_key_key" ON "subscription_plans"("key");
CREATE INDEX "subscription_plans_active_idx" ON "subscription_plans"("active");
CREATE INDEX "billing_subscriptions_companyId_idx" ON "billing_subscriptions"("companyId");
CREATE INDEX "billing_subscriptions_planId_idx" ON "billing_subscriptions"("planId");
CREATE INDEX "billing_subscriptions_status_idx" ON "billing_subscriptions"("status");
CREATE UNIQUE INDEX "invoices_number_key" ON "invoices"("number");
CREATE INDEX "invoices_companyId_idx" ON "invoices"("companyId");
CREATE INDEX "invoices_subscriptionId_idx" ON "invoices"("subscriptionId");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
CREATE INDEX "payments_companyId_idx" ON "payments"("companyId");
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");
CREATE INDEX "payments_status_idx" ON "payments"("status");
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");
CREATE INDEX "coupons_active_idx" ON "coupons"("active");
CREATE UNIQUE INDEX "communication_providers_channel_name_key" ON "communication_providers"("channel", "name");
CREATE INDEX "communication_providers_enabled_idx" ON "communication_providers"("enabled");
CREATE INDEX "notification_deliveries_notificationId_idx" ON "notification_deliveries"("notificationId");
CREATE INDEX "notification_deliveries_channel_idx" ON "notification_deliveries"("channel");
CREATE INDEX "notification_deliveries_status_idx" ON "notification_deliveries"("status");
CREATE UNIQUE INDEX "search_index_documents_entity_entityId_key" ON "search_index_documents"("entity", "entityId");
CREATE INDEX "search_index_documents_entity_idx" ON "search_index_documents"("entity");
CREATE INDEX "search_index_documents_keywords_idx" ON "search_index_documents" USING GIN ("keywords");

ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "platform_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "platform_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_role_assignments" ADD CONSTRAINT "platform_role_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_role_assignments" ADD CONSTRAINT "platform_role_assignments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "platform_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content_pages" ADD CONSTRAINT "content_pages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_clients" ADD CONSTRAINT "crm_clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_clients" ADD CONSTRAINT "crm_clients_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_contacts" ADD CONSTRAINT "crm_contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales_opportunities" ADD CONSTRAINT "sales_opportunities_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales_opportunities" ADD CONSTRAINT "sales_opportunities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "crm_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "crm_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "crm_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analytics_reports" ADD CONSTRAINT "analytics_reports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "csv_exports" ADD CONSTRAINT "csv_exports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "billing_subscriptions" ADD CONSTRAINT "billing_subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "billing_subscriptions" ADD CONSTRAINT "billing_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "billing_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
