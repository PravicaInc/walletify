export enum WalletSetupFlow {
  CreateWallet = 'CreateWallet',
  RestoreWallet = 'RestoreWallet',
}

export type RootStackParamList = {
  Splash: undefined;
  Home: { seedPhrase: string; password: string };
  Onboarding: undefined;
  WalletSetup: undefined;
  ConfirmSeedPhrase: { seedPhrase: string; password: string };
  CreatePassword: {
    flow: WalletSetupFlow;
  };
  SeedRestore: { password: string };
  OldPassword: { seedPhrase: string } | undefined;
  Settings: undefined;
  Login: undefined;
  ChangePassword: undefined;
  ShowSeedPhrase: { seedPhrase?: string; password?: string };
  RecoverSeedPhrase: undefined;
};
