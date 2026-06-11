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

@Entity("CampaignPhoto")
export class CampaignPhoto {
  @PrimaryGeneratedColumn({ name: "CampaignPhotoId" })
  campaignPhotoId!: number;

  @Column("integer", { name: "CampaignId", nullable: false })
  campaignId!: number;

  @Column("integer", { name: "AccId", nullable: false })
  accId!: number;

  @Column("text", { name: "ImageUrl", nullable: false })
  imageUrl!: string;

  @Column("text", { name: "Caption", nullable: true })
  caption?: string | null;

  @Column("integer", { name: "IsCheckinPhoto", nullable: false, default: 0 })
  isCheckinPhoto!: number;

  @Column("integer", { name: "IsDeleted", nullable: false, default: 0 })
  isDeleted!: number;

  @Column("text", { name: "CreatedAt", nullable: false })
  createdAt!: string;

  @ManyToOne("Campaign")
  @JoinColumn({ name: "CampaignId" })
  campaign!: Relation<Campaign>;

  @ManyToOne("Account")
  @JoinColumn({ name: "AccId" })
  account!: Relation<Account>;
}
