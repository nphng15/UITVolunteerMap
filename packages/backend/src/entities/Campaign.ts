import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Campaign")
export class Campaign {
  @PrimaryGeneratedColumn({ name: "CampaignId" })
  campaignId!: number;

  @Column("text", { name: "CampaignName", nullable: false, unique: true })
  campaignName!: string;

  @Column("text", { name: "StartDate", nullable: false })
  startDate!: string;

  @Column("text", { name: "EndDate", nullable: false })
  endDate!: string;

  @Column("text", { name: "Description", nullable: true })
  description?: string | null;

  @ManyToOne("User", (user: any) => user.campaigns)
  @JoinColumn({ name: "UserId" })
  user!: any;

  @OneToMany("Team", (team: any) => team.campaign)
  teams!: any[];

  @OneToMany("Post", (post: any) => post.campaign)
  posts!: any[];
}
