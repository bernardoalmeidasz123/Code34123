import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text, Card, TextInput, SegmentedButtons, Snackbar } from "react-native-paper";
import api from "../api/client";
import FuturisticButton from "../components/FuturisticButton";

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];

export default function ExercisesScreen() {
  const [selectedLang, setSelectedLang] = useState("PYTHON");
  const [exercises, setExercises] = useState([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/exercises/language/${selectedLang}`);
      setExercises(res.data.exercises || []);
    } catch (e) {
      setExercises([]);
    }
  };

  useEffect(() => {
    load();
  }, [selectedLang]);

  const submit = async (exerciseId) => {
    const passed = code.trim().length > 0; // placeholder evaluation
    const res = await api.post(`/exercises/${exerciseId}/submit`, { code, output: "", passed });
    setMessage(passed ? "Enviado! ✅" : "Falhou nos testes.");
    return res.data;
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#050b14" }}>
      <SegmentedButtons
        value={selectedLang}
        onValueChange={setSelectedLang}
        buttons={languages.map((l) => ({ value: l, label: l }))}
        style={{ marginBottom: 12 }}
      />
      {exercises.length === 0 ? <Text style={{ color: "#94a3b8" }}>Desbloqueie a linguagem para ver exercícios.</Text> : null}
      {exercises.map((ex) => (
        <Card key={ex.id} style={{ marginBottom: 12, backgroundColor: "#0b1220" }}>
          <Card.Title title={ex.title} titleStyle={{ color: "#e2e8f0" }} />
          <Card.Content>
            <Text style={{ color: "#94a3b8" }}>{ex.content}</Text>
            <TextInput
              mode="outlined"
              multiline
              value={code}
              onChangeText={setCode}
              placeholder={ex.starterCode || "// código"}
              style={{ marginTop: 8 }}
            />
            <FuturisticButton style={{ marginTop: 8 }} onPress={() => submit(ex.id)}>
              Enviar
            </FuturisticButton>
          </Card.Content>
        </Card>
      ))}
      <Snackbar visible={!!message} onDismiss={() => setMessage("")} duration={2000}>
        {message}
      </Snackbar>
    </ScrollView>
  );
}
