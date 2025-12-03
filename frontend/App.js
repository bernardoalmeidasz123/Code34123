import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, IconButton } from "react-native-paper";
import { ActivityIndicator, View, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ExercisesScreen from "./src/screens/ExercisesScreen";
import PurchasesScreen from "./src/screens/PurchasesScreen";
import AdminScreen from "./src/screens/AdminScreen";
import { AuthContext } from "./src/hooks/useAuth";
import { ThemeContext } from "./src/hooks/useTheme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Exercícios" component={ExercisesScreen} />
      <Tab.Screen name="Compras" component={PurchasesScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const load = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedToken) setToken(savedToken);
      if (savedTheme === "dark") setDark(true);
      setLoading(false);
    };
    load();
  }, []);

  const authValue = useMemo(
    () => ({
      token,
      setToken: async (t) => {
        setToken(t);
        if (t) {
          await AsyncStorage.setItem("token", t);
        } else {
          await AsyncStorage.removeItem("token");
        }
      },
    }),
    [token]
  );

  const themeValue = useMemo(
    () => ({
      dark,
      toggle: async () => {
        const next = !dark;
        setDark(next);
        await AsyncStorage.setItem("theme", next ? "dark" : "light");
      },
    }),
    [dark]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#050b14" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const baseColors = {
    primary: "#3b82f6",
    secondary: "#0ea5e9",
    background: "#050b14",
    surface: "#0b1220",
    text: "#e2e8f0",
    outline: "#1f2937",
  };

  const paperTheme = dark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: baseColors.primary,
          secondary: baseColors.secondary,
          background: baseColors.background,
          surface: baseColors.surface,
          onSurface: baseColors.text,
          onPrimary: "#e5e7eb",
          outline: baseColors.outline,
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: baseColors.primary,
          secondary: baseColors.secondary,
          background: "#0f172a",
          surface: "#111827",
          onSurface: baseColors.text,
          onPrimary: "#e5e7eb",
          outline: baseColors.outline,
        },
      };

  const navTheme = dark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: baseColors.primary,
          background: baseColors.background,
          card: baseColors.surface,
          text: baseColors.text,
          border: baseColors.outline,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: baseColors.primary,
          background: "#0f172a",
          card: "#111827",
          text: baseColors.text,
          border: baseColors.outline,
        },
      };

  return (
    <ThemeContext.Provider value={themeValue}>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle={dark ? "light-content" : "light-content"} backgroundColor={paperTheme.colors.background} />
        <AuthContext.Provider value={authValue}>
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator>
              {token ? (
                <Stack.Screen
                  name="Main"
                  component={MainTabs}
                  options={{
                    headerRight: () => (
                      <IconButton icon={dark ? "white-balance-sunny" : "moon-waning-crescent"} onPress={themeValue.toggle} />
                    ),
                    title: "Code34",
                  }}
                />
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Registrar" component={RegisterScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
