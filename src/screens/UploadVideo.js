//Jacquys Barbosa da SIlva e nicole de Oliveira Cafalloni
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert, View, Button, ActivityIndicator, Text, TextInput } from "react-native";
import { supabase } from "../../supabaseConfig";
import { decode as atob } from "base-64";

export default function UploadVideo({ navigation }) {
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  async function pickVideo() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log("Resultado do picker:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const selectedVideo = {
          uri: asset.uri,
          name: asset.name || "video.mp4",
          type: asset.mimeType || "video/mp4",
        };
        setVideo(selectedVideo);
        console.log("Vídeo selecionado:", selectedVideo);
      } else {
        Alert.alert("Erro", "Nenhum vídeo selecionado.");
      }
    } catch (error) {
      console.error("Erro ao selecionar vídeo:", error);
      Alert.alert("Erro", "Não foi possível selecionar o vídeo.");
    }
  }

  async function uploadVideo() {
    if (!video || !category.trim()) {
      Alert.alert("Erro", "Por favor, selecione um vídeo e informe a categoria");
      return;
    }

    setUploading(true);

    try {
      const timestamp = new Date().getTime();
      const cleanCategory = category
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "_");
      const filePath = `${cleanCategory}/${timestamp}-${video.name}`;

      const base64 = await FileSystem.readAsStringAsync(video.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { data, error } = await supabase.storage
        .from("videos")
        .upload(filePath, bytes, {
          cacheControl: "3600",
          upsert: false,
          contentType: video.type,
        });

      if (error) {
        console.error("Erro no upload:", error);
        Alert.alert("Erro", "Falha ao enviar o vídeo.");
      } else {
        Alert.alert("Sucesso", "Vídeo enviado com sucesso!");
        setVideo(null);
        setCategory("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro inesperado no upload:", error);
      Alert.alert("Erro", "Erro inesperado durante o upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Selecionar Vídeo" onPress={pickVideo} />

      {video && <Text style={{ marginVertical: 10 }}>Vídeo selecionado: {video.name}</Text>}

      <TextInput
        placeholder="Categoria do vídeo"
        value={category}
        onChangeText={setCategory}
        style={{
          height: 50,
          borderColor: "#ccc",
          borderWidth: 1,
          paddingHorizontal: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Enviar Vídeo" onPress={uploadVideo} disabled={!video || !category.trim()} />
      )}
    </View>
  );
}
