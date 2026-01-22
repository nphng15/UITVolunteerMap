import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Role")
export class Role {
  @PrimaryGeneratedColumn({ name: "RoleId" })
  roleId!: number;

  @Column("text", { name: "RoleName" })
  roleName!: string;

  @OneToMany("Account", (account: any) => account.role)
  accounts!: any[];
}
