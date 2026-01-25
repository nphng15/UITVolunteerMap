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

  @OneToMany("User", "team")
  users!: Relation<User[]>;

  @OneToMany("Photo", "team")
  photos!: Relation<Photo[]>;

  @ManyToOne("Campaign", "teams")
  @JoinColumn({ name: "CampaignId" })
  campaign!: Relation<Campaign>;
}
