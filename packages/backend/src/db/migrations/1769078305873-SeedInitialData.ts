import { MigrationInterface } from "typeorm";

// Seed data đã được gộp về một nguồn duy nhất: src/db/seeds (runSeeds),
// chạy tự động lúc server start. Migration này giữ no-op để không phá vỡ
// chuỗi migration trên các DB đã chạy nó trước đây.
export class SeedInitialData1769078305873 implements MigrationInterface {

    public async up(): Promise<void> {
        // intentionally empty — see src/db/seeds/index.ts
    }

    public async down(): Promise<void> {
        // intentionally empty
    }
}