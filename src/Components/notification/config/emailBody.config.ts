import * as FS from "fs";
import * as Path from "path";

const GetEmailBodyPath = (fileName: string): unknown => {
  return FS.readFileSync(
    Path.join(
      __dirname,
      `../../../../../src/Components/notification/EmailTemplates/${fileName}`
    ),
    "utf8"
  );
};

const GetNewWaitistSignUpEmailBody = (): string => {
  const data = GetEmailBodyPath("WelcomeToWailist.html") as unknown as string;

  return data;
};
const GetWaitlistReferredEmailBody = (): string => {
  const data = GetEmailBodyPath(
    "UsedWaitlistReferral.html"
  ) as unknown as string;

  return data;
};

// Authentication
const GetEmailBodyWithPath = (path: string): string => {
  const data = GetEmailBodyPath(path) as unknown as string;

  return data;
};

export {
  GetNewWaitistSignUpEmailBody,
  GetWaitlistReferredEmailBody,
  GetEmailBodyWithPath,
};
