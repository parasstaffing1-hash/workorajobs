import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  const apiPrefix = config.getOrThrow<string>("app.apiPrefix");
  const corsOrigins = config.getOrThrow<string[]>("security.corsOrigins");
  const isProduction =
    config.getOrThrow<string>("app.nodeEnv") === "production";

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(cookieParser(config.getOrThrow<string>("security.cookieSecret")));
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Workora-Automation-Secret",
    ],
  });
  app.getHttpAdapter().getInstance().disable("x-powered-by");

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(app.get(LoggingInterceptor));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Workora Jobs API")
    .setDescription(
      "Full-stack Workora Jobs API for authentication, employer and candidate workflows, recruiter tools, ATS, AI assistance and automation.",
    )
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(config.getOrThrow<number>("app.port"));
}

void bootstrap();
