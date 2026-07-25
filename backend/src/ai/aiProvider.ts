import { z } from "zod";

export const ParsedIntentSchema = z.object({
  action: z.string(),
  amount: z.number(),
  sourceToken: z.string(),
  targetToken: z.string()
});

export type ParsedIntentResult = z.infer<typeof ParsedIntentSchema>;

export interface AIProvider {
  parseIntent(text: string): Promise<ParsedIntentResult>;
}
