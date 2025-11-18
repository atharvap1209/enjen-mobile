import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MyTasksScreen } from '../screens/MyTasksScreen';
import { StageTaskScreen } from '../screens/StageTaskScreen';
import { QCFormScreen } from '../screens/QCFormScreen';
import { PutawayTaskScreen } from '../screens/PutawayTaskScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';

// Stack Navigators
const AuthStack = createNativeStackNavigator();
const MyTasksStack = createNativeStackNavigator();
const ScanStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Auth Stack Component
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
  </AuthStack.Navigator>
);

// Stack Components
const MyTasksStackScreen = () => (
  <MyTasksStack.Navigator screenOptions={{ headerShown: false }}>
    <MyTasksStack.Screen name="MyTasksScreen" component={MyTasksScreen} />
    <MyTasksStack.Screen name="StageTaskScreen" component={StageTaskScreen} />
    <MyTasksStack.Screen name="QCFormScreen" component={QCFormScreen} />
    <MyTasksStack.Screen name="PutawayTaskScreen" component={PutawayTaskScreen} />
  </MyTasksStack.Navigator>
);

const ScanStackScreen = () => (
  <ScanStack.Navigator screenOptions={{ headerShown: false }}>
    <ScanStack.Screen name="ScanScreen" component={ScanScreen} />
  </ScanStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Main App Navigator
export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user === null ? (
        // Show Auth Stack when user is not logged in
        <AuthStackScreen />
      ) : (
        // Show Main App Tabs when user is logged in
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="MyTasks"
            component={MyTasksStackScreen}
            options={{
              tabBarLabel: 'My Tasks',
            }}
          />
          <Tab.Screen
            name="Scan"
            component={ScanStackScreen}
            options={{
              tabBarLabel: 'Scan',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});

