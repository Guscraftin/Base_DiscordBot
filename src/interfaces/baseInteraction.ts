export default interface CustomBaseInteraction {
  botPermissions?: bigint[];
  cooldown?: number;
  deferOptions?: { ephemeral: boolean };
}
