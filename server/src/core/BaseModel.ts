import { Document, Schema, Model, model } from 'mongoose';

export interface IBaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITimestampedDocument extends IBaseDocument {
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditedDocument extends ITimestampedDocument {
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface IVersionedDocument extends IAuditedDocument {
  version: number;
  history: Array<{
    content: string;
    date: Date;
    version: number;
    updatedBy: Schema.Types.ObjectId;
  }>;
}

export const defaultSchemaOptions = {
  timestamps: true,
  toJSON: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

export const auditFields = {
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
};

export const versionFields = {
  version: {
    type: Number,
    default: 1
  },
  history: [{
    content: String,
    date: { type: Date, default: Date.now },
    version: Number,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
};

export abstract class BaseModel<T extends IBaseDocument> {
  protected schema: Schema;
  protected modelName: string;
  public model: Model<T>;

  constructor(name: string, schema: Schema) {
    this.modelName = name;
    this.schema = schema;
    this.applyDefaultOptions();
    this.model = model<T>(name, schema);
  }

  private applyDefaultOptions() {
    this.schema.set('timestamps', true);
    this.schema.set('toJSON', {
      transform: (doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    });
  }

  protected addAuditFields() {
    this.schema.add(auditFields);
  }

  protected addVersionFields() {
    this.schema.add(versionFields);
  }

  protected addIndexes(indexes: any[]) {
    indexes.forEach(index => {
      this.schema.index(index);
    });
  }
}
