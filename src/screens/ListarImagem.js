import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../supabaseConfig';

const Galeria = () => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImagens = async () => {
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erro ao obter usuário:", userError?.message);
      setLoading(false);
      return;
    }

    const userId = user.id;

    try {
      const { data, error } = await supabase.storage
        .from("images")
        .list(`galeria/${userId}`, { limit: 100 });

      if (error) {
        console.error("Erro ao listar imagens:", error.message);
        setLoading(false);
        return;
      }

      const urls = await Promise.all(
        data
          .filter(item => item.name)
          .map(async (item) => {
            const { data: urlData, error: urlError } = supabase
              .storage
              .from("images")
              .getPublicUrl(`galeria/${userId}/${item.name}`);

            if (urlError) {
              console.error("Erro ao obter URL:", urlError.message);
              return null;
            }

            return {
              name: item.name,
              url: urlData.publicUrl,
            };
          })
      );

      setImagens(urls.filter(img => img !== null));
    } catch (err) {
      console.error("Erro inesperado:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImagens();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Galeria de Fotos</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && imagens.length === 0 && (
        <Text style={styles.noImagesText}>Nenhuma imagem encontrada.</Text>
      )}

      <View style={styles.gallery}>
        {imagens.map((img, index) => (
          <Image key={index} source={{ uri: img.url }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Galeria;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noImagesText: {
    fontSize: 18,
    color: '#999',
    marginVertical: 10,
    textAlign: 'center',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10, // gap ainda não é suportado oficialmente, veja abaixo
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    margin: 5,
    resizeMode: 'cover',
  },
});
