export enum WalletSetupFlow {
  CreateWallet = 'CreateWallet',
  RestoreWallet = 'RestoreWallet',
}

export type RootStackParamList = {
  Splash: undefined;
  Home: { seedPhrase: string; password: string };
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
  Login: undefined;
  ChangePassword: undefined;
  EnterPassword: {
    nextScreen: string;
  };
};
