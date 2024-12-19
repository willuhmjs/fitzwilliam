import { ChatInputCommandInteraction, GuildMember, GuildMemberRoleManager, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder().setName("alumnify").setDescription("[ADMIN] Toggle the alumni role on a member.").addUserOption(option => option.setName('member').setDescription('The member to alumni').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles).setContexts(InteractionContextType.Guild),
    run: async (interaction: ChatInputCommandInteraction) => {
        const member = interaction.options.getMember('member') as GuildMember;
        if (!interaction.guild) {
            await interaction.reply({ content: 'Guild not found.', ephemeral: true });
            return;
        }
        const alumniRole = interaction.guild.roles.cache.find(role => role.name === 'Alumni');
        if (!alumniRole) {
            await interaction.reply({ content: 'Alumni role not found.', ephemeral: true });
            return;
        }

        if (member) {
            if ('cache' in member.roles && member.roles.cache.has(alumniRole.id)) {
                await member.roles.remove(alumniRole);
                await interaction.reply({ content: `${member} is no longer an Alumni.`, ephemeral: true });
            } else {
                await (member.roles as GuildMemberRoleManager).add(alumniRole);
                await interaction.reply({ content: `${member} is now an Alumni.`, ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Member not found.', ephemeral: true });
        }
    }
}