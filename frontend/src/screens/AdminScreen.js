import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import api from "../api/client";
import FuturisticButton from "../components/FuturisticButton";

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const load = async () => {
    const [u, p] = await Promise.all([api.get("/admin/users"), api.get("/admin/purchases")]);
    setUsers(u.data.users || []);
    setPurchases(p.data.purchases || []);
  };

  useEffect(() => {
    load();
  }, []);

  const confirm = async (id) => {
    await api.post(`/admin/language/${id}/status`, { status: "CONFIRMED" });
    load();
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#050b14" }}>
      <Text variant="headlineSmall" style={{ marginBottom: 8, color: "#e2e8f0" }}>
        Usuários
      </Text>
      {users.map((u) => (
        <Card key={u.id} style={{ marginBottom: 8, backgroundColor: "#0b1220" }}>
          <Card.Title title={u.email} titleStyle={{ color: "#e2e8f0" }} subtitle={u.role} subtitleStyle={{ color: "#94a3b8" }} />
        </Card>
      ))}

      <Text variant="headlineSmall" style={{ marginVertical: 8, color: "#e2e8f0" }}>
        Compras
      </Text>
      {purchases.map((p) => (
        <Card key={p.id} style={{ marginBottom: 8, backgroundColor: "#0b1220" }}>
          <Card.Title
            title={`${p.language} - ${p.status}`}
            titleStyle={{ color: "#e2e8f0" }}
            subtitle={p.pixKey}
            subtitleStyle={{ color: "#94a3b8" }}
            right={() => <Chip style={{ backgroundColor: "#111827" }}>{p.amountCents / 100} R$</Chip>}
          />
          <Card.Actions>
            <FuturisticButton onPress={() => confirm(p.id)} style={{ flex: 1 }}>
              Confirmar
            </FuturisticButton>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}
