export type RootStackParamList = {
  Splash: undefined;
  Home: { seedPhrase: string; password: string };
  OnBoarding: undefined;
  WalletSetup: undefined;
  ConfirmSeedPhrase: { seedPhrase: string; password: string };
  CreatePassword: {
    nextScreen: string;
  };
  SeedRestore: { password: string };
  OldPassword: { seedPhrase: string } | undefined;
  Settings: undefined;
  WalletUnlock: { nextAction: any, resetAction: any };
  ManageAccounts: undefined;
  ChangePassword: undefined;
  CreateSeedPhrase: { password: string };
  RecoverSeedPhrase: undefined;
};
