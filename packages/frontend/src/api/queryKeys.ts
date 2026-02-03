export const campaignKeys = {
  all: ["campaigns"] as const,
  detail: (id: number) => ["campaigns", id] as const,
};
