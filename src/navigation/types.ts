export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Onboarding: undefined;
  WalletSetup: undefined;
  SeedGeneration: undefined;
  SeedConfirmation: undefined;
  CreatePassword:
    | { progressBar: { finished: number; total: number } }
    | undefined;
  SeedRestore: undefined;
  KeychainPOC: undefined;
  OldPassword: { seedPhrase: string } | undefined;
};
