import { Id, RelationMappings } from 'objection';
import { Capacity } from '../errors/Capacity';
import cuboid from '../factories/cuboid';
import { Bag } from './Bag';
import Base from './Base';

export class Cuboid extends Base {
  id!: Id;
  width!: number;
  height!: number;
  depth!: number;
  bagId?: Id;
  bag!: Bag;
  volume!: number;

  static tableName = 'cuboids';

  static get relationMappings(): RelationMappings {
    return {
      bag: {
        relation: Base.BelongsToOneRelation,
        modelClass: 'Bag',
        join: {
          from: 'cuboids.bagId',
          to: 'bags.id',
        },
      },
    };
  }

  calculateVolume(): number {
    return this.width * this.height * this.depth;
  }

  async $beforeInsert(): Promise<void> {
    const currVolumen = this.calculateVolume();
    const bag = await Bag.query().findById(<number>this.bagId) as Bag;
    
    if ( bag.volume < currVolumen ) {
      throw new Capacity('Insufficient capacity in bag');
    }
    this.volume = this.calculateVolume();
  }

  async $beforeUpdate(): Promise<void> {
    const currVolumen = this.calculateVolume();
    const bag = await Bag.query().findById(<string>this.bagId) as Bag;
    if ( bag.volume < currVolumen ) {
      throw new Capacity('Insufficient capacity in bag');
    }

    this.volume = this.calculateVolume();
  }
}

export default Cuboid;
