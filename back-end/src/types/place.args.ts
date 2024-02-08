import { Field, ArgsType } from "type-graphql";
import { MinLength } from "class-validator";
import { Geometry } from "typeorm";
import { GeoJSONPoint } from "./scalar/geoJSONPoint";
import Category from "../entities/category";

@ArgsType()
export class CreatePlace {
  @Field()
  @MinLength(3)
  name!: string;

  @Field()
  @MinLength(10)
  description!: string;

  @Field((type) => GeoJSONPoint)
  coordinates!: Geometry;

  @Field(() => [String], { nullable: true })
  categoryIds?: string[];
}
@ArgsType()
export class UpdatePlace {
  @Field()
  @MinLength(3)
  name!: string;

  @Field()
  @MinLength(10)
  description!: string;

  @Field((type) => GeoJSONPoint)
  coordinates!: Geometry;

  @Field(() => [String], { nullable: true })
  categoryIds?: string[];
}