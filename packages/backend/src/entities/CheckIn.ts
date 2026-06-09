import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import type { Campaign } from "./Campaign.js";
import type { Account } from "./Account.js";

@Entity("CheckIn")
export class CheckIn {
  @PrimaryGeneratedColumn({ name: "CheckInId" })
  checkInId!: number;

  @Column("integer", { name: "CampaignId", nullable: false })
  campaignId!: number;

  @Column("integer", { name: "AccId", nullable: false })
  accId!: number;

  @Column("real", { name: "Latitude", nullable: false })
  latitude!: number;

  @Column("real", { name: "Longitude", nullable: false })
  longitude!: number;

  @Column("real", { name: "Distance", nullable: false })
  distance!: number;

  @Column("text", { name: "CheckedInAt", nullable: false })
  checkedInAt!: string;

  @Column("text", { name: "ImageUrl", nullable: true })
  imageUrl?: string | null;

  @ManyToOne("Campaign")
  @JoinColumn({ name: "CampaignId" })
  campaign!: Relation<Campaign>;

  @ManyToOne("Account")
  @JoinColumn({ name: "AccId" })
  account!: Relation<Account>;
}
