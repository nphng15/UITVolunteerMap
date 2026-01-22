import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Account")
export class Account {
  @PrimaryGeneratedColumn({ name: "AccID" })
  accId!: number;

  @Column("text", { name: "Username", nullable: false, unique: true })
  username!: string;

  @Column("text", { name: "Password", nullable: false })
  password!: string;

  @Column("integer", { name: "RoleId", nullable: false })
  roleId!: number;

  @Column("text", { name: "CreateAt", nullable: true })
  createAt?: string | null;

  @Column("text", { name: "UpdatedAt", nullable: true })
  updatedAt?: string | null;

  @ManyToOne("Role", (role: any) => role.accounts)
  @JoinColumn({ name: "RoleId" })
  role!: any;

  @OneToOne("User", (user: any) => user.account)
  user?: any;
}
