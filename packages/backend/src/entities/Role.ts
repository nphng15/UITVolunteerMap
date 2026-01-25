import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import type { Account } from "./Account.js";

@Entity("Role")
export class Role {
  @PrimaryGeneratedColumn({ name: "RoleId" })
  roleId!: number;

  @Column("text", { name: "RoleName" })
  roleName!: string;

  @OneToMany("Account", "role")
  accounts!: Relation<Account[]>;
}
