import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  tags: [string];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
