import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Usuario } from "./Usuario";
import { RegistroHabito } from "./RegistroHabito";

@Entity()
export class Habito {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, (u) => u.habitos)
  usuario!: Usuario;

  @OneToMany(() => RegistroHabito, (r) => r.habito)
  registros?: RegistroHabito[];
}