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
  };
  SeedRestore: { password: string };
  OldPassword: { seedPhrase: string } | undefined;
  Settings: undefined;
  ManageAccounts: undefined;
  ChangePassword: undefined;
  CreateSeedPhrase: { password: string };
  RecoverSeedPhrase: undefined;
};
