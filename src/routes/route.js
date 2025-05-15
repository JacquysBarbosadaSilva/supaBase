import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Cadastrar from "../screens/Cadastrar"; 
import Home from "../screens/Home";
import UploadImages from "../screens/UploadImage";
import Logout from "../screens/Logout";
import UploadVideo from "../screens/UploadVideo";
import EditarPerfil from "../screens/EditarPerfil";
import ListarImagem from "../screens/ListarImagem";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <Logout {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home} 
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="ListarImagem"
        component={ListarImagem} 
        options={{
          drawerLabel: "Galeria",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="UploadImages"
        component={UploadImages} 
        options={{
          drawerLabel: "Upload Imagens",
          drawerIcon: ({ color, size }) => (
            <Feather name="upload" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="UploadVideo"
        component={UploadVideo} 
        options={{
          drawerLabel: "Upload Videos",
          drawerIcon: ({ color, size }) => (
            <Feather name="upload" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="EditarPerfil"
        component={EditarPerfil} 
        options={{
          drawerLabel: "Editar Perfil",
          drawerIcon: ({ color, size }) => (
            <Feather name="profile" size={size} color={color} />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}

function StackNavigator() {
  return (

    <Stack.Navigator initialRouteName="Login">

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cadastrar"
        component={Cadastrar}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UploadImages"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ListarImagem"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UploadVideo"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="EditarPerfil"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}

export default StackNavigator;
