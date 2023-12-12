import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/abstract.schema';

@Schema({ versionKey: false })
export class AuthLock extends AbstractDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  lockExpiredAt: Date;

  @Prop()
  failedAttempts: Date[];
}

export const AuthLockSchema = SchemaFactory.createForClass(AuthLock);
