import { z } from "zod";

const envSchema = z.object({
	SECRET: z.string(),
});

const env = envSchema.parse(Bun.env);

export default env;
