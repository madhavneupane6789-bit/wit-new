import { Role, UserStatus, SubscriptionStatus } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        status: UserStatus;
        isApproved: boolean;
        isActive: boolean;
        subscriptionEndDate?: Date;
        subscriptionStatus: SubscriptionStatus;
      };
    }
  }
}

export {};
