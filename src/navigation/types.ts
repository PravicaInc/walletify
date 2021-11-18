export enum WalletSetupFlow {
  CreateWallet = 'CreateWallet',
  RestoreWallet = 'RestoreWallet',
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Onboarding: undefined;
  WalletSetup: undefined;
  SeedConfirmation: undefined;
  CreatePassword: {
    flow: WalletSetupFlow;
  };
  SeedRestore: { password: string };
  OldPassword: { seedPhrase: string } | undefined;
  Settings: undefined;
  ChangePassword: undefined;
  ShowSeedPhrase: { seedPhrase?: string; password?: string };
  RecoverSeedPhrase: undefined;
};
