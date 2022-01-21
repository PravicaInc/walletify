export type RootStackParamList = {
  Splash: undefined;
  Home: { seedPhrase: string; password: string };
  OnBoarding: undefined;
  WalletSetup: undefined;
  ConfirmSeedPhrase: { seedPhrase: string; password: string };
  CreatePassword: {
    nextScreen: string;
    handleEditPassword: (
      oldPassword: string,
      newPassword: string,
    ) => Promise<any>;
    handleCheckPassword: (password: string) => Promise<any>;
  };
  SeedRestore: { password: string };
  OldPassword: { seedPhrase: string } | undefined;
  Settings: undefined;
  WalletUnlock: { nextAction: any; resetAction: any };
  ManageAccounts: undefined;
  ChangePassword: undefined;
  CreateSeedPhrase: { password: string };
  RecoverSeedPhrase: undefined;
};
