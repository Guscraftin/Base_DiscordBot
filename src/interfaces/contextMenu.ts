/* eslint-disable no-unused-vars */
import {
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
} from "discord.js";
import CustomBaseInteraction from "./baseInteraction";
import { CustomClient } from "bot";

export default interface CustomContextMenuCommandInteraction
  extends CustomBaseInteraction {
  data: ContextMenuCommandBuilder;
  execute: (
    client: CustomClient,
    interaction: ContextMenuCommandInteraction,
  ) => Promise<void>;
}
