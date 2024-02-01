import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    MultiPoint,
    OneToMany,
    Point,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { ObjectType, Field, ID, Float } from "type-graphql";
  
//   import Category from "./category";
  import { CreatePlace, UpdatePlace } from "./place.args";
    
  // import Note from "./note";
  
  
  @Entity()
  @ObjectType()
  class Place extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => ID)
    id!: string;
  
    @Column()
    @Field()
    name!: string;
  
    @Column()
    @Field()
    description!: string;
    
    // @ManyToOne(() => User, (user) => user.Places, { eager: true })
    // @Field()
    // owner!: User;

    // @JoinTable({ name: "CategoryForPlaces" })
    // @ManyToMany(() => Category, (category) => category.places, { eager: true })
    // @Field(() => [Category])
    // categories!: Category[];
  
    // @Column()
    // @Field(() => [Float])
    // point!: Point[];

    // @OneToMany(() => Note, (note) => note.place)
    // @Field(() => [Note])
    // notes!: Note[];

    // @Column({ default: "" })
    // @Field()
    // picture!: string;
  
    @CreateDateColumn()
    @Field()
    createdAt!: Date;
  
  
    constructor(place?: CreatePlace) {
      super();
  
      if (place) {
        if (!place.name) {
          throw new Error("Place name cannot be empty.");
        }
        this.name = place.name;

        if (!place.description) {
          throw new Error("Place description cannot be empty.");
        }
        this.description = place.description;

        // this.categories = place.categoryIds;
        // if (!place.point) {
        //   throw new Error("Place coordinates cannot be empty.");
        // }
        // this.point = place.point;
        // this.notes = place.notes;
      }
    }
  
    static async saveNewPlace(placeData: CreatePlace): Promise<Place> {
      const newPlace = new Place(placeData);

      // if (placeData.categoryIds) {
      //   newPlace.categories = await Promise.all(placeData.categoryIds.map(Category.getCategoryById));
      // }

      const savedPlace = await newPlace.save();
      console.log(`New Place saved: ${savedPlace.getStringRepresentation()}.`);
      return savedPlace;
    }
  
    static async getPlaces(): Promise<Place[]> {
      const places = await Place.find();
      // const places = await Place.find({
      //   where: { category: { id: categoryId } },
      //   order: { createdAt: "DESC" },
      // });
      return places;
    }
  
    static async getPlaceById(id: string): Promise<Place> {
      const place = await Place.findOneBy({ id });
      if (!place) {
        throw new Error(`Place with ID ${id} does not exist.`);
      }
      return place;
    }
  
    static async deletePlace(id: string): Promise<Place> {
      const place = await Place.getPlaceById(id);
      await Place.delete(id);
      return place;
    }
  
    static async updatePlace(id: string, partialPlace: UpdatePlace): Promise<Place> {
      const place = await Place.getPlaceById(id);
      Object.assign(place, partialPlace);

      // if (partialPlace.categoryIds) {
      //   place.categories = await Promise.all(partialPlace.categoryIds.map(Category.getCategoryById));
      // }
  
      await place.save();
      place.reload();
      return place;
    }
  
    getStringRepresentation(): string {
      return `${this.id} | ${this.name} | ${this.description}}`;
    }
  }
  
  export default Place;