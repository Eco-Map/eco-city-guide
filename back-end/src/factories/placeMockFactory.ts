import { DeepPartial } from "typeorm";
import { TypeFactory } from "interface-forge";
import { Geometry } from "geojson";
import { faker } from "@faker-js/faker";
import City from "../entities/city";
import Category from "../entities/category";

const minLatitude = 48.8;
const maxLatitude = 48.93;
const minLongitude = 2.22;
const maxLongitude = 2.43;

export interface PlaceInterface {
  name: string;
  description: string;
  coordinates: Geometry;
  address: string;
  city: DeepPartial<City>;
  categories?: DeepPartial<Category>[];
}

export class PlaceMockFactory {
  private typeFactory: TypeFactory<DeepPartial<PlaceInterface>>;

  constructor() {
    this.typeFactory = new TypeFactory<DeepPartial<PlaceInterface>>(
      async () => ({
        name: "Eco-" + faker.commerce.department(),
        description: faker.lorem.sentence({ min: 3, max: 21 }),
        coordinates: {
          type: "Point",
          coordinates: [
            faker.location.latitude({ min: minLatitude, max: maxLatitude }),
            faker.location.longitude({ min: minLongitude, max: maxLongitude }),
          ],
        },
        address: faker.location.streetAddress({ useFullAddress: true }),
        city: faker.helpers.arrayElement(["Paris", "Lyon"]),
      }),
    );
  }

  async create(categoryIds?: string[]): Promise<DeepPartial<PlaceInterface>> {
    const placeData = await this.typeFactory.build();
    if (categoryIds && categoryIds.length > 0) {
      placeData.categories = categoryIds.map((categoryId) => ({
        id: categoryId,
      }));
    }
    return placeData;
  }
}
