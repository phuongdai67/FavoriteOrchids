import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getOrchidById } from "../api/axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [orchid, setOrchid] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchOrchid = async () => {
      const data = await getOrchidById(id);
      setOrchid(data);
    };

    fetchOrchid();
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={35}
              style={{ ...styles.backIcon, marginLeft: -90 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 10,
              marginBottom: 0,
            }}
          >
            {orchid.name}
          </Text>
        </View>
      </View>
      <Image
        source={{ uri: orchid.image }}
        style={{
          width: 400,
          height: 480,
          marginTop: 10,
          borderRadius: 10,
          marginBottom: -11,
        }}
      />
      <View style={styles.infoContainer}>
        <View style={styles.categoryContainer}>
          <MaterialCommunityIcons name="flower-outline" size={28} />
          <Text style={{ ...styles.category, fontWeight: 500 }}>
            {orchid.category}
          </Text>
        </View>
        <ScrollView
          style={styles.descriptionContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
            }}
          >
            {orchid.description}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    position: "relative", // Add this line
  },

  infoContainer: {
    borderWidth: 1,
    borderColor: "green",
    padding: 20,
    width: "97%",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 27,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  category: {
    fontSize: 25,
    marginLeft: 10,
  },
  descriptionContainer: {
    marginTop: 10,
    maxHeight: 150, // Đặt chiều cao tối đa cho ScrollView
  },
  backButtonContainer: {
    position: "absolute", // Add this line
    left: 10, // Adjust as needed
    top: 10, // Adjust as needed
  },
});
