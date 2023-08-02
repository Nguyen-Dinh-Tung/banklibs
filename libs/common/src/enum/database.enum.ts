export enum TypeVerificationEnum {
  EMAIL = 'email',
  INFORMATION = 'information',
}

export enum KycStatusUserEnum {
  PENDING = 'pending',
  REJECT = 'reject',
  ACCEPT = 'accept',
}

export enum TypeOtpEmailEnum {
  VERIFICATION = 'verification',
  FEATURE = 'feature',
  FORGOT_PASSWORD = 'forgot_passwod',
}

export enum TypeTransactionEnum {
  PAY = 'pay',
  TRANSFER = 'transfer',
  SYSTEM_HANDLE = 'system_handle',
}

export enum StatusTransactionEnum {
  SUCCESS = 'success',
  FAIL = 'fail',
  PEDING = 'pending',
}

export enum MediaNotificationEnum {
  SMS = 'sms',
  SYSTEM = 'system',
  EMAIL = 'email',
}

export enum RoleActionsEnum {
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
}
