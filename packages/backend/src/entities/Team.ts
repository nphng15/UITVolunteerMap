import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import type { User } from "./User.js";
import type { Photo } from "./Photo.js";
import type { Campaign } from "./Campaign.js";

@Entity("Team")
export class Team {
  @PrimaryGeneratedColumn({ name: "TeamId" })
  teamId!: number;

  @Column("text", { name: "TeamName", nullable: false, unique: true })
  teamName!: string;

  @Column("text", { name: "Description", nullable: true })
  description?: string | null;

  @Column("integer", { name: "LeaderId", nullable: true })
  leaderId?: number | null;

  @Column("text", { name: "ImageUrl", nullable: true })
  imageUrl?: string | null;

  @Column("integer", { name: "IsDeleted", nullable: false, default: 0 })
  isDeleted!: number;

  @ManyToOne("User", { nullable: true })
  @JoinColumn({ name: "LeaderId" })
  leader?: Relation<User>;

  @OneToMany("User", "team")
  users!: Relation<User[]>;

  @OneToMany("Photo", "team")
  photos!: Relation<Photo[]>;

  @ManyToOne("Campaign", "teams")
  @JoinColumn({ name: "CampaignId" })
  campaign!: Relation<Campaign>;
}
