import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import api from "../api/client";
import FuturisticButton from "../components/FuturisticButton";

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];

export default function HomeScreen() {
  const [freeExercises, setFreeExercises] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const load = async () => {
    const [freeRes, purchaseRes] = await Promise.all([api.get("/exercises/free"), api.get("/purchases/mine").catch(() => ({ data: { purchases: [] } }))]);
    setFreeExercises(freeRes.data.exercises || []);
    setPurchases(purchaseRes.data.purchases || []);
  };

  useEffect(() => {
    load();
  }, []);

  const hasLanguage = (lang) => purchases.some((p) => p.language === lang && p.status === "CONFIRMED");

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#050b14" }}>
      <Text variant="headlineSmall" style={{ marginBottom: 8, color: "#e2e8f0" }}>
        Exercícios gratuitos
      </Text>
      {freeExercises.map((ex) => (
        <Card key={ex.id || ex.slug} style={{ marginBottom: 8, backgroundColor: "#0b1220" }}>
          <Card.Title title={ex.title} titleStyle={{ color: "#e2e8f0" }} />
          <Card.Content>
            <Text style={{ color: "#94a3b8" }}>{ex.content}</Text>
          </Card.Content>
        </Card>
      ))}

      <Text variant="headlineSmall" style={{ marginVertical: 12, color: "#e2e8f0" }}>
        Linguagens
      </Text>
      {languages.map((lang) => (
        <Card key={lang} style={{ marginBottom: 8, backgroundColor: "#0b1220" }}>
          <Card.Title
            title={lang}
            titleStyle={{ color: "#e2e8f0" }}
            right={() => (
              <Chip icon={hasLanguage(lang) ? "lock-open" : "lock"} style={{ backgroundColor: "#111827" }} textStyle={{ color: "#e2e8f0" }}>
                {hasLanguage(lang) ? "Liberada" : "Bloqueada"}
              </Chip>
            )}
          />
          <Card.Actions>
            <FuturisticButton onPress={() => {}} disabled={hasLanguage(lang)} style={{ flex: 1 }}>
              Desbloquear linguagem
            </FuturisticButton>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}
