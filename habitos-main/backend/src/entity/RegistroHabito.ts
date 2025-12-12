import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Habito } from "./Habito";
import { Usuario } from "./Usuario";

@Entity()
export class RegistroHabito {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column("date")
  data!: string; 

  @Column()
  status!: string; 

  @ManyToOne(() => Habito, (h) => h.registros, { eager: true, onDelete: "CASCADE" })
  habito!: Habito;

  @ManyToOne(() => Usuario, (u) => u.registros)
  usuario!: Usuario;
}