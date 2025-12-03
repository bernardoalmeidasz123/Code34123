import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import FuturisticButton from "../components/FuturisticButton";

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      await setToken(res.data.token);
    } catch (e) {
      setError(e.response?.data?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#050b14",
      }}
    >
      <Text variant="headlineLarge" style={{ marginBottom: 12, color: colors.onSurface }}>
        Code34
      </Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ marginBottom: 12 }} />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 12 }} />
      {error ? (
        <Text style={{ color: colors.error, marginBottom: 8 }} variant="bodyMedium">
          {error}
        </Text>
      ) : null}
      <FuturisticButton onPress={handleLogin} loading={loading}>
        Entrar
      </FuturisticButton>
      <FuturisticButton onPress={() => navigation.navigate("Registrar")} style={{ marginTop: 8 }} mode="outlined">
        Criar conta
      </FuturisticButton>
    </View>
  );
}
