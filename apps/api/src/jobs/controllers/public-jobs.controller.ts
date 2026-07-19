import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { SearchJobsDto } from "../dto/search-jobs.dto";
import { JobsService } from "../jobs.service";

@ApiTags("Jobs")
@Controller("jobs")
export class PublicJobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  search(@Query() query: SearchJobsDto) {
    return this.jobs.search(query);
  }

  @Get("featured")
  featured() {
    return this.jobs.featured();
  }

  @Get("latest")
  latest() {
    return this.jobs.latest();
  }

  @Get(":id")
  details(@Param("id") id: string) {
    return this.jobs.details(id);
  }
}
