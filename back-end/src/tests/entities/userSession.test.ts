import { resetDatabase } from "../resetDatabase";
import User from "../../entities/user";
import UserSession from "../../entities/userSession";
import { newUsersDataset } from "./user.dataset";

describe("User", () => {
  resetDatabase();

  describe("saveNewSession", () => {
    it("should save as many sessions as requested.", async () => {
      const user: User = new User(newUsersDataset[0]);
      await UserSession.saveNewSession(user);
      await UserSession.saveNewSession(user);
      const sessions = await UserSession.find({
        where: { user: { id: user.id } },
      });
      expect(sessions).toHaveLength(2);
    });
  });
});
