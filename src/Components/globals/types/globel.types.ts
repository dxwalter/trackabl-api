import { ErrorSeverity } from "./error-logs.constants";

enum Severity {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface SystemErrorLogDTO {
  severity: Severity;
  message: string;
  details: any;
}
