/* eslint-disable no-unused-vars */
import CustomBaseInteraction from "./baseInteraction";
import { CustomClient } from "bot";
import { ModalSubmitInteraction } from "discord.js";

export default interface CustomModalInteraction extends CustomBaseInteraction {
  data: {
    name: string;
  };
  execute: (
    client: CustomClient,
    interaction: ModalSubmitInteraction,
  ) => Promise<void>;
}
