import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { TransactionsScreen } from '../screens/transactions/TransactionsScreen';
import { AddTransactionScreen } from '../screens/transactions/AddTransactionScreen';
import { GoalsScreen } from '../screens/goals/GoalsScreen';
import { DebtsScreen } from '../screens/debts/DebtsScreen';
import { RoomScreen } from '../screens/room/RoomScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// ── Stack param list (for screens that push other screens) ────────────────────
export type AppStackParamList = {
  MainTabs: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
};

// ── Tab param list ─────────────────────────────────────────────────────────────
type TabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Goals: undefined;
  Debts: undefined;
  Room: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { paddingBottom: 4, height: 60 },
        tabBarActiveTintColor: '#6200EE',
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Resumo', tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} /> }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: 'Transações', tabBarIcon: ({ focused }) => <TabIcon emoji="💸" focused={focused} /> }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: 'Metas', tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} /> }}
      />
      <Tab.Screen
        name="Debts"
        component={DebtsScreen}
        options={{ title: 'Dívidas', tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} /> }}
      />
      <Tab.Screen
        name="Room"
        component={RoomScreen}
        options={{ title: 'Sala', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: 'Nova Transação', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
