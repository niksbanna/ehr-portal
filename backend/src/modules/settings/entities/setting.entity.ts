import { Setting as PrismaSetting } from '@prisma/client';

export class SettingEntity implements PrismaSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
