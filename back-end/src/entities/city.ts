import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Geometry } from "geojson";
import { ObjectType, Field, ID } from "type-graphql";
import { GeoJSONPoint } from "../types/scalar/geoJSONPoint";
import { getCoordinates } from "../api/coordinates";
import Place from "./place";

@Entity()
@ObjectType()
@Unique("custom_unique_city", ["name", "coordinates"])
class City extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  name!: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
  })
  @Field(() => GeoJSONPoint)
  coordinates!: Geometry;

  @OneToMany(() => Place, (place) => place.city)
  places!: Place[];

  constructor(city?: City) {
    super();
    if (city) {
      if (!city.name) {
        throw new Error("Le nom de la ville ne peut pas être vide.");
      }
      this.name = city.name;

      if (!city.coordinates) {
        throw new Error(
          "Les coordonnées de la ville ne peuvent pas être vides.",
        );
      }
      this.coordinates = city.coordinates;
    }
  }

  static async saveNewCity(name: string): Promise<City> {
    try {
      const coordinates = await getCoordinates(name);
      const city = new City();
      city.name = name;
      city.coordinates = coordinates;
      return await city.save();
    } catch (error) {
      throw new Error("Error creating city: " + error);
    }
  }

  static async getCities(): Promise<City[]> {
    return await City.find();
  }

  static async getCityByName(name: string): Promise<City | null> {
    return await City.findOneBy({ name });
  }
}

export default City;
