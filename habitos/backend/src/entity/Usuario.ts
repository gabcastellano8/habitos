import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Habito } from "./Habito";
import { RegistroHabito } from "./RegistroHabito";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @OneToMany(() => Habito, (h) => h.usuario)
  habitos?: Habito[];

  @OneToMany(() => RegistroHabito, (r) => r.usuario)
  registros?: RegistroHabito[];
}