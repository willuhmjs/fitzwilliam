import { z } from 'zod';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const CommandSchema = z.object({
    data: z.instanceof(SlashCommandBuilder),
    run: z.function().args(z.custom<ChatInputCommandInteraction>((val) => val instanceof ChatInputCommandInteraction)).returns(z.promise(z.void()))
});

export type Command = z.infer<typeof CommandSchema>;
