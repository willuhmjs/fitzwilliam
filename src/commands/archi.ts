import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder().setName("archi").setDescription("Ask Archibald AI a question").addStringOption(option => option.setName('question').setDescription('The question you want to ask Archibald').setRequired(true)),
    run: async (interaction: ChatInputCommandInteraction) => {
        console.log(Date.now());
        const question = interaction.options.getString('question');
        await interaction.deferReply();
        const fetch = (await import('node-fetch')).default;

        const response = await fetch('https://archibald.cs.odu.edu/api/generate', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "Origin": "https://ai.cs.odu.edu"


            },
            body: JSON.stringify({
                question: "Response must be less than 2000 characters. " + question
            })
        });
        const d = await response.json() as { response: string };
        console.log(d);
        let fixedResponse = d.response;

        const urlRegex = /!\[(.*?)\]\((.*?)\)/g;
        fixedResponse = fixedResponse.replace(urlRegex, (match, altText, url) => {
            if (!url.startsWith('http')) {
            url = new URL(url, "https://systems.cs.odu.edu/img/").href;
            }
            return `[${altText}](${url})`;
        });

        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        fixedResponse = fixedResponse.replace(linkRegex, (match, p1, p2) => {
            return `[${p1}](${p2} "target=_blank")`;
        });

        const widthRegex = /{width=".*?"}/g;
        fixedResponse = fixedResponse.replace(widthRegex, '');

        if (fixedResponse.length > 2000) {
            fixedResponse = `${fixedResponse.substring(0, 1997).trim()}...`;
        }
        await interaction.editReply(fixedResponse);
    }
}