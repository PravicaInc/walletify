export type RootStackParamList = {
  Splash: undefined;
  EnterPassword: undefined;
  SendScreen: { fullBalance: any; price: any };
  Home: undefined;
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
