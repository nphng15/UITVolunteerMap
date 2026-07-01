import { DataSource } from "typeorm";

export const seedPosts = async (_dataSource: DataSource) => {
  console.log("Post seed skipped; sample posts are seeded by seedRemoteImages.");
};
