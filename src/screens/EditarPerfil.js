import React, { useState, useEffect } from "react";
import { Alert, View, Text, TextInput, Button, Image, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { supabase } from "../../supabaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode as atob } from "base-64";

const EditarPerfil = ({ navigation }) => {
    const [nome, setNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [fotoAtual, setFotoAtual] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            const user = authData?.user;

            if (authError || !user) {
                console.error("Erro ao obter usuário:", authError);
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            setNovoEmail(user.email);

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("nome, photo_url")
                .eq("id", user.id)
                .single();

            if (userError) {
                console.error("Erro ao carregar dados do usuário:", userError);
            } else {
                setNome(userData.nome || "");
                setFotoAtual(userData.photo_url || "");
            }
        };

        fetchUserData();
    }, []);

    const handlePickImage = async () => {
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

            if (!result.canceled && result.assets && result.assets[0].uri) {
                await uploadImageToSupabase(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    const uploadImageToSupabase = async (uri) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.getUser();
            const user = data?.user;

            if (error || !user) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            let fileExt = uri.split(".").pop().toLowerCase();
            if (!fileExt || fileExt.length > 4) fileExt = "jpg";

            const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
            if (!validExtensions.includes(fileExt)) fileExt = "jpg";

            const filePath = `${user.id}/profile.jpg`; // Nome fixo para sobrescrever

            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const fileBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

            const { error: uploadError } = await supabase.storage.from("image-profile").upload(filePath, fileBuffer, {
                contentType: `image/${fileExt}`,
                upsert: true,
            });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("image-profile").getPublicUrl(filePath);

            const finalUrl = `${urlData.publicUrl}?t=${Date.now()}`; // Força o refresh do cache com um timestamp na URL

            setFotoAtual(finalUrl);

            const { error: updateError } = await supabase
                .from("users")
                .update({ photo_url: finalUrl })
                .eq("id", user.id);

            if (updateError) throw updateError;

            Alert.alert("Sucesso", "Foto de perfil atualizada!");
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            Alert.alert("Erro", error.message || "Não foi possível atualizar a foto de perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user;

        if (error || !user) {
            Alert.alert("Erro", "Usuário não autenticado.");
            return;
        }

        try {
            await supabase.from("users").update({ nome: nome }).eq("id", user.id);

            if (novoEmail !== user.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email: novoEmail });
                if (emailError) throw emailError;
            }

            if (novaSenha) {
                const { error: senhaError } = await supabase.auth.updateUser({ password: novaSenha });
                if (senhaError) throw senhaError;
            }

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar perfil: ", error);
            Alert.alert("Erro", "Ocorreu um erro ao atualizar o perfil.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

            {fotoAtual ? (
                <Image source={{ uri: fotoAtual }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={{ color: "#888" }}>Sem foto</Text>
                </View>
            )}

            <Button title="Trocar Foto" onPress={handlePickImage} />

            <Text style={styles.label}>Nome:</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />

            <Text style={styles.label}>E-mail:</Text>
            <TextInput
                style={styles.input}
                value={novoEmail}
                onChangeText={setNovoEmail}
                placeholder="Seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Senha Atual:</Text>
            <TextInput
                style={styles.input}
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="Senha atual"
                secureTextEntry
            />

            <Text style={styles.label}>Nova Senha:</Text>
            <TextInput
                style={styles.input}
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Nova senha"
                secureTextEntry
            />

            <Button title="Salvar Alterações" onPress={handleUpdateProfile} disabled={isLoading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 50,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        alignSelf: "center",
    },
    avatarPlaceholder: {
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        marginTop: 15,
        marginBottom: 5,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 5,
    },
});

export default EditarPerfil;
