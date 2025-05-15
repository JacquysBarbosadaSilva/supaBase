// Jacquys Barbosa Silva e Nicole de Oliveira Cafalloni

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";


const Home = ({ navigation }) => {
  const img = "https://img.freepik.com/vetores-gratis/vetor-azul-escuro-do-fundo-da-historia-do-facebook-de-memphis_53876-162121.jpg?t=st=1743519404~exp=1743523004~hmac=0956c84fe373416ac4719a6be4a53a27d5f2f68a70c952c7f34477f065057055&w=740";
 

  const handleLogout = async () => {
    navigation.navigate("RealizarLogin");
  };

  return (
    <ImageBackground source={{ uri: img }} style={styles.background}>
      <Text style={styles.titulo}>Menu Principal</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    width: "80%",
    alignItems: "stretch",
    paddingHorizontal: 20,
  },
  botaoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export default Home;
