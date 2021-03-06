import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'facebook_id', nullable: true })
  facebookId?: string;

  @Column({ name: 'picture_url', nullable: true })
  pictureUrl?: string;

  @Column({ nullable: true })
  initials?: string;
}
