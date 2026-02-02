import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import type { Post } from "./Post.js";
import type { Team } from "./Team.js";

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

  @Column("integer", { name: "IsDeleted", nullable: false, default: 0 })
  isDeleted!: number;

  @ManyToOne("Post", "photos", { nullable: true })
  @JoinColumn({ name: "PostID" })
  post?: Relation<Post>;

  @ManyToOne("Team", "photos", { nullable: true })
  @JoinColumn({ name: "TeamId" })
  team?: Relation<Team>;
}
