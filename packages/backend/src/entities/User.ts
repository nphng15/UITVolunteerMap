import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn({ name: "UserId" })
  userId!: number;

  @Column("text", { name: "FullName", nullable: false })
  fullName!: string;

  @Column("text", { name: "Mssv", nullable: true })
  mssv?: string | null;

  @Column("text", { name: "Class", nullable: true })
  class?: string | null;

  @Column("text", { name: "Email", nullable: false, unique: true })
  email!: string;

  @Column("text", { name: "PhoneNumber", nullable: true })
  phoneNumber?: string | null;

  @ManyToOne("Team", (team: any) => team.users)
  @JoinColumn({ name: "TeamId" })
  team!: any;

  @OneToOne("Account", (account: any) => account.user)
  @JoinColumn({ name: "AccId" })
  account?: any;

  @OneToMany("Post", (post: any) => post.author)
  posts!: any[];
}
