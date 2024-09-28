/* eslint-disable no-unused-vars */
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CustomBaseInteraction from "./baseInteraction";
import { CustomClient } from "bot";

export default interface CustomSlashCommandInteraction
  extends CustomBaseInteraction {
  data: SlashCommandBuilder;
  execute: (
    client: CustomClient,
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>;
}
