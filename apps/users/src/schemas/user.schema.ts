import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  attributes: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
