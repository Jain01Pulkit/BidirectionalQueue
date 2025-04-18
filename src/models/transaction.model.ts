import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  stringsInstructions: Array<any>;

  @Prop()
  method: string;

  @Prop()
  signedDto: Array<any>;

  @Prop()
  uniqueId: string;

  @Prop()
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);