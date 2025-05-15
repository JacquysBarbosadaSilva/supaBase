//Jacquys Barbosa da SIlva e nicole de Oliveira Cafalloni
import React, { useState, useEffect } from "react";
import { Alert, Button, Platform, TextInput, View, StyleSheet } from "react-native";
import { supabase } from "../../supabaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";

export default function UploadFoto({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [nomeImagem, setNomeImagem] = useState("");

  useEffect(() => {
    // Solicita permissão para notificações
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Atenção", "Permissões de notificação não concedidas.");
      }
    })();
  }, []);

  const escolherImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Permita o acesso à galeria para trocar a foto.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri);
        await uploadImage(selectedUri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;
      if (authError || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const timestamp = new Date().getTime();
      let fileExt = uri.split(".").pop().toLowerCase();
      if (!fileExt || fileExt.length > 4) fileExt = "jpg";

      const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!validExtensions.includes(fileExt)) fileExt = "jpg";

      const safeNome = nomeImagem.trim() !== "" ? nomeImagem.replace(/\s+/g, "_") : "imagem";
      const filename = `${user.id}_${safeNome}_${timestamp}.${fileExt}`;
      const filePath = `galeria/${user.id}/${filename}`;

      let file;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        file = await response.blob();
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        file = bytes.buffer;
      }

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
      const finalUrl = `${urlData.publicUrl}?t=${timestamp}`;

      // Notificação local de sucesso
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Imagem enviada!",
          body: "Sua imagem foi enviada com sucesso.",
        },
        trigger: null,
      });

      console.log("URL pública da imagem:", finalUrl);

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert("Erro", error.message || "Falha ao enviar imagem.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome da imagem"
        value={nomeImagem}
        onChangeText={setNomeImagem}
        style={styles.input}
      />
      <Button title="Escolher Imagem" onPress={escolherImagem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
