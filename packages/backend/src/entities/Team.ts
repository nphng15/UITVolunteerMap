import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Team")
export class Team {
  @PrimaryGeneratedColumn({ name: "TeamId" })
  teamId!: number;

  @Column("text", { name: "TeamName", nullable: false, unique: true })
  teamName!: string;

  @Column("text", { name: "Description", nullable: true })
  description?: string | null;

  @OneToMany("User", (user: any) => user.team)
  users!: any[];

  @OneToMany("Photo", (photo: any) => photo.team)
  photos!: any[];

  @ManyToOne("Campaign", (campaign: any) => campaign.teams)
  @JoinColumn({ name: "CampaignId" })
  campaign!: any;
}
