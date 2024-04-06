// require("newrelic");

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "../src/Components/app/app.module";
import { Utils } from "./Components/utils";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*",
  });

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV !== "test") {
    app.use(new Utils().SetupLogService());
  }
  await app.listen(Number(process.env.PORT) ?? 0);
}
bootstrap();
