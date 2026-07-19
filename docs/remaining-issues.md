# WorkoraJobs - Remaining Issues (RC1)

The following items are noted for launch staging:

1. **AWS / Production Services Provisioning**
   - **Description:** Currently, the local development and preview environment uses a database-offline fallback mode (returning mock data).
   - **Impact:** Medium. Before running in production on AWS, real instances of PostgreSQL and Redis must be provisioned, and their connection URLs must be added to the .env variables.
