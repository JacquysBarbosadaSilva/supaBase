//Jacquys Barbosa da SIlva e nicole de Oliveira Cafalloni
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../supabaseConfig";
import { useNavigation } from "@react-navigation/native";

const backgroundImg =
  "https://bucket-storage-senai-25.s3.us-east-1.amazonaws.com/imagens/imf-fundo-login.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const loginUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Usuário logado com sucesso!", data.user);
      return data.user;
    } catch (error) {
      console.error("Erro no login:", error.message);
      Alert.alert("Erro no login", error.message);
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      const user = await loginUser(email, password);
      if (user) {
        navigation.navigate("Home"); 
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha email e senha.");
    }
  };

  return (
    <ImageBackground source={{ uri: backgroundImg }} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.navigate("Cadastrar")}
          style={styles.cadastrar}
        >
          Cadastrar-se
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#1B0000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cadastrar: {
    color: "#1B0000",
    fontWeight: "bold",
    marginTop: 10,
  },
});
