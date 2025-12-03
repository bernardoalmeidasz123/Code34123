import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import FuturisticButton from "../components/FuturisticButton";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", { email, password, name });
      await setToken(res.data.token);
    } catch (e) {
      setError(e.response?.data?.message || "Falha no cadastro");
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
        Cadastre-se
      </Text>
      <TextInput label="Nome" value={name} onChangeText={setName} style={{ marginBottom: 12 }} />
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ marginBottom: 12 }} />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 12 }} />
      {error ? (
        <Text style={{ color: colors.error, marginBottom: 8 }} variant="bodyMedium">
          {error}
        </Text>
      ) : null}
      <FuturisticButton onPress={handleRegister} loading={loading}>
        Criar conta
      </FuturisticButton>
    </View>
  );
}
