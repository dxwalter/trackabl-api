export interface SavePushNotificationDevice {
  device_id: string;
  userId: number;
}
export interface SaveEmailResponse {
  receiver: string | string[];
  status: boolean;
  subject: string;
  data: any;
}

type firebaseOptions = {
  collapseKey?: string | undefined;
  contentAvailable?: boolean;
  dryRun?: boolean;
  priority?: string;
};

type firebaseNotification = {
  title: string;
  body: string;
};

export interface firebasePayload {
  options?: firebaseOptions;
  notification: firebaseNotification;
  data?: any;
  registrationToken: string[];
}

export interface SendEmail {
  subject: string;
  recipientEmail: string;
  recipientName: string;
  emailType: string;
  senderEmailAddress?: string;
  emailBody?: string;
}

export interface SendSmsSingleSms {
  to: string;
  sms: string;
}
