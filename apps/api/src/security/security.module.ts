import { Module } from "@nestjs/common";

import { CsrfGuard } from "./guards/csrf.guard";
import { CsrfService } from "./services/csrf.service";

@Module({
  providers: [CsrfService, CsrfGuard],
  exports: [CsrfService, CsrfGuard],
})
export class SecurityModule {}
