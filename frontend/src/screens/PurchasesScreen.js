import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text, Card, TextInput, SegmentedButtons } from "react-native-paper";
import api from "../api/client";
import FuturisticButton from "../components/FuturisticButton";

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];

export default function PurchasesScreen() {
  const [selectedLang, setSelectedLang] = useState("PYTHON");
  const [amount, setAmount] = useState("9900");
  const [purchases, setPurchases] = useState([]);
  const [qr, setQr] = useState("");

  const load = async () => {
    const res = await api.get("/purchases/mine");
    setPurchases(res.data.purchases || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const res = await api.post("/purchases/create", {
      language: selectedLang,
      amountCents: parseInt(amount, 10) || 0,
    });
    setQr(res.data.purchase.pixQrCode);
    load();
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#050b14" }}>
      <Text variant="headlineSmall" style={{ marginBottom: 8, color: "#e2e8f0" }}>
        Comprar linguagem
      </Text>
      <SegmentedButtons value={selectedLang} onValueChange={setSelectedLang} buttons={languages.map((l) => ({ value: l, label: l }))} />
      <TextInput label="Valor em centavos (PIX)" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ marginTop: 8 }} />
      <FuturisticButton style={{ marginTop: 8 }} onPress={create}>
        Gerar PIX
      </FuturisticButton>
      {qr ? (
        <Card style={{ marginTop: 12, backgroundColor: "#0b1220" }}>
          <Card.Title title="QR Code PIX" titleStyle={{ color: "#e2e8f0" }} />
          <Card.Content>
            <Text selectable style={{ color: "#94a3b8" }}>
              {qr}
            </Text>
          </Card.Content>
        </Card>
      ) : null}

      <Text variant="headlineSmall" style={{ marginVertical: 12, color: "#e2e8f0" }}>
        Minhas compras
      </Text>
      {purchases.map((p) => (
        <Card key={p.id} style={{ marginBottom: 8, backgroundColor: "#0b1220" }}>
          <Card.Title
            title={`${p.language} - ${p.status}`}
            titleStyle={{ color: "#e2e8f0" }}
            subtitle={`R$ ${(p.amountCents / 100).toFixed(2)}`}
            subtitleStyle={{ color: "#94a3b8" }}
          />
        </Card>
      ))}
    </ScrollView>
  );
}
