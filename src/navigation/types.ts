export enum WalletSetupFlow {
  CreateWallet = 'CreateWallet',
  RestoreWallet = 'RestoreWallet',
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Onboarding: undefined;
  WalletSetup: undefined;
  SeedGeneration: { password: string };
  SeedConfirmation: undefined;
  CreatePassword: {
    flow: WalletSetupFlow;
  };
  SeedRestore: { password: string };
  KeychainPOC: undefined;
  OldPassword: { seedPhrase: string } | undefined;
  Settings: { password?: string };
  ChangePassword: undefined;
  EnterPassword: {
    nextScreen: string;
  };
};
