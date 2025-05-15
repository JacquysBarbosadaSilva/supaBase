//Jacquys Barbosa da SIlva e nicole de Oliveira Cafalloni
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { supabase } from "../../supabaseConfig"; // ajuste caminho

export default function Logout(props) {
  const { navigation } = props;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    } else {
      navigation.replace("Login");
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginLeft: 20,
    marginTop: 20,
  },
  logoutText: {
    color: "#Fb3a34",
    fontWeight: "bold",
    fontSize: 16,
  },
});
