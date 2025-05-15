import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../supabaseConfig';
import { useNavigation } from "@react-navigation/native";

const Cadastro = () => {
  const navigation = useNavigation();  // <-- falta isso
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const registrarUsuario = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: { nome: nome } // adiciona campo customizado
        }
      });

      if (error) throw error;

      navigation.navigate("Login"); 
      setEmail('');
      setSenha('');
      setNome('');
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={registrarUsuario} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  }
});

export default Cadastro;
