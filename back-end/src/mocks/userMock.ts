import User from "../entities/user";
import { dataSource } from "../data-source";
import { hash } from "bcrypt";
import { UserMockFactory } from "../factories/userMockFactory";

export async function createUserMock() {
  await dataSource.initialize();
  const userRepository = dataSource.getRepository(User);
  const webAdministrator = await new UserMockFactory().create(
    "Ganondorf",
    "Dragmire",
    "web-admin@gmail.com",
    "password",
    "webAdministrator"
  );
  if (webAdministrator.hashedPassword) {
    webAdministrator.hashedPassword = await hash(
      webAdministrator.hashedPassword,
      10
    );
  }
  const cityAdministrator = await new UserMockFactory().create(
    "Gandalf",
    "Le gris",
    "city-admin@gmail.com",
    "password",
    "cityAdministrator"
  );
  if (cityAdministrator.hashedPassword) {
    cityAdministrator.hashedPassword = await hash(
      cityAdministrator.hashedPassword,
      10
    );
  }
  const user = await new UserMockFactory().create(
    "Pac",
    "Man",
    "user@gmail.com",
    "password",
    "user"
  );
  if (user.hashedPassword) {
    user.hashedPassword = await hash(user.hashedPassword, 10);
  }

  await userRepository.save([webAdministrator, cityAdministrator, user]);
  process.stdout.write("Generated Users Data saved to the database.");
}

createUserMock();
