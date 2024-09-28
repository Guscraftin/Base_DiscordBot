/* eslint-disable no-unused-vars */
import CustomBaseInteraction from "./baseInteraction";
import { CustomClient } from "bot";
import { StringSelectMenuInteraction } from "discord.js";

export default interface CustomStringSelectMenuInteraction
  extends CustomBaseInteraction {
  data: {
    name: string;
  };
  execute: (
    client: CustomClient,
    interaction: StringSelectMenuInteraction,
  ) => Promise<void>;
}
