import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Launches: undefined;
  Map: { launchpadId?: string };
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  LaunchDetail: { id: string };
};
