import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Post")
export class Post {
  @PrimaryGeneratedColumn({ name: "PostId" })
  postId!: number;

  @Column("text", { name: "Title", nullable: false })
  title!: string;

  @Column("text", { name: "Content", nullable: false })
  content!: string;

  @Column("text", { name: "Status", nullable: false, default: "draft" })
  status!: string;

  @Column("integer", { name: "IsDeleted", nullable: false, default: 0 })
  isDeleted!: number;

  @ManyToOne("Campaign", (campaign: any) => campaign.posts)
  @JoinColumn({ name: "CampaignId" })
  campaign!: any;

  @ManyToOne("User", (user: any) => user.posts)
  @JoinColumn({ name: "AuthorId" })
  author!: any;

  @OneToMany("Photo", (photo: any) => photo.post)
  photos!: any[];
}
