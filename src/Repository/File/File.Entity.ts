// import { _File, FileStatus, FileType, FileVisibility } from '@shared/types/File'
// import { Field, ObjectType, registerEnumType } from 'type-graphql'
// import { ObjectId } from '@/utils'
// import { getModelForClass, prop } from '@typegoose/typegoose'
// import { _DataField, Ref } from '@shared/types/utilTypes'
// import { User } from '@/Repository/User/User.entity'
// import { DataField } from '@/Repository/DataField.entity'
// import { UploadedFile } from '@/modules/files/utils'
//
// registerEnumType(FileType, {
//   name: 'FileType'
// })
//
// registerEnumType(FileStatus, {
//   name: 'FileStatus'
// })
//
// class _UploadedFile implements UploadedFile {
//   @prop()
//   id!: string
//   @prop()
//   fileName!: string
//   @prop()
//   bucket!: string
//   @prop()
//   endpoint!: string
//   @prop()
//   ETag?: string
//   @prop()
//   originalName?: string
//   @prop()
//   mimetype!: string
//   @prop()
//   mime!: string
//   @prop()
//   extension?: string
//   @prop({ enum: FileType, type: String })
//   type!: FileType
// }
//
// @ObjectType()
// export class File implements _File {
//   @Field(returns => String, { nullable: true })
//   // @ts-ignore
//   readonly _id?: ObjectId
//
//   @Field({ nullable: true })
//   @prop()
//   name?: string
//
//   @Field(type => User, { nullable: true })
//   @prop({ ref: 'User' })
//   createdBy?: Ref<User>
//
//   @Field(type => FileType, { nullable: true })
//   @prop({ enum: FileType, type: String, default: FileType.DOC })
//   type?: FileType
//
//   @Field(type => FileStatus, { nullable: true })
//   @prop({ enum: FileStatus, type: String, default: FileStatus.UNUSED })
//   status?: FileStatus
//
//   @prop({ _id: false, type: _UploadedFile })
//   uploadedFile?: UploadedFile
//
//   @prop()
//   url?: string
//
//   @Field({ nullable: true })
//   @prop()
//   fileName?: string
//
//   @Field({ nullable: true })
//   publicUrl?: string
//
//   @Field({ nullable: true })
//   @prop()
//   extension?: string
//
//   @Field(type => DataField, { nullable: true })
//   @prop({ type: DataField })
//   data?: _DataField[]
//
//   @prop({ enum: FileVisibility, type: String, default: FileVisibility.PUBLIC })
//   visibility?: FileVisibility
// }
//
// export const FileModel = getModelForClass(File, {
//   schemaOptions: {
//     timestamps: true,
//     collection: 'files'
//   }
// })
