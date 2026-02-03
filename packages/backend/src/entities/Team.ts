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
import type { Campaign } from "./Campaign.js";
import { Attachment } from "./Attachment.js";

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

  @OneToMany("Attachment", "team")
  attachments!: Relation<Attachment[]>;

  @ManyToOne("Campaign", "teams")
  @JoinColumn({ name: "CampaignId" })
  campaign!: Relation<Campaign>;
}
