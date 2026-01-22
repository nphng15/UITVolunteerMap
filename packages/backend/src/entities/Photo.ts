import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Photo")
export class Photo {
  @PrimaryGeneratedColumn({ name: "PhotoId" })
  photoId!: number;

  @Column("text", { name: "Title", nullable: true })
  title?: string | null;

  @Column("text", { name: "ImageUrl", nullable: false, unique: true })
  imageUrl!: string;

  @Column("text", { name: "UploadedAt", nullable: false })
  uploadedAt!: string;

  @ManyToOne("Post", (post: any) => post.photos)
  @JoinColumn({ name: "PostID" })
  post!: any;
}
