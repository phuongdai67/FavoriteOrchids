import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
export default function FavoriteScreen() {
  const [likedOrchids, setLikedOrchids] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // State của dislike All
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const fetchLikedOrchids = async () => {
        try {
          const likedOrchidsData = await AsyncStorage.getItem("likedOrchids");
          if (likedOrchidsData) {
            setLikedOrchids(JSON.parse(likedOrchidsData));
          }
        } catch (error) {
          console.error("Error fetching liked orchids:", error);
        }
      };

      fetchLikedOrchids();
    }, [])
  );

  const handleDislikePress = (orchid) => {
    setSelectedOrchid(orchid);
    setModalVisible(true);
  };

  const handleConfirmDislike = async () => {
    const updatedLikedOrchids = likedOrchids.filter(
      (likedOrchid) => likedOrchid.id !== selectedOrchid.id
    );

    setLikedOrchids(updatedLikedOrchids);
    await AsyncStorage.setItem(
      "likedOrchids",
      JSON.stringify(updatedLikedOrchids)
    );

    setModalVisible(false);
  };
  const handleTrashPress = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmDislikeAll = async () => {
    setLikedOrchids([]);
    await AsyncStorage.setItem("likedOrchids", JSON.stringify([]));

    setConfirmModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có muốn bỏ yêu thích không?
            </Text>
            <View style={styles.modalButtons}>
              <View style={{ marginRight: 120 }}>
                <Button title="Có" onPress={handleConfirmDislike} />
              </View>
              <Button title="Không" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có muốn bỏ yêu thích tất cả loài hoa trong danh sách không?
            </Text>
            <View style={styles.modalButtons}>
              <View style={{ marginRight: 120 }}>
                <Button title="Có" onPress={handleConfirmDislikeAll} />
              </View>
              <Button
                title="Không"
                onPress={() => setConfirmModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách yêu thích</Text>
        <TouchableOpacity onPress={handleTrashPress}>
          <Ionicons
            name="trash"
            size={28}
            color="#db1c07"
            style={{ marginTop: 62, marginLeft: 120 }}
          />
        </TouchableOpacity>
      </View>
      {likedOrchids.map((orchid) => (
        <View key={orchid.id} style={styles.cardContainer}>
          <View style={styles.orchidContainer}>
            <Text style={styles.orchidName}>{orchid.name}</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Detail", { id: orchid.id });
                }}
              >
                <Image
                  source={{ uri: orchid.image }}
                  style={styles.orchidImage}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDislikePress(orchid)}>
                <Ionicons
                  name="heart-dislike"
                  size={30}
                  color="#db1c07"
                  style={{ marginLeft: 50 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Màu nền trắng
  },
  titleContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 60,
    marginLeft: 25,
  },
  cardContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "green",
    marginTop: 20,
    margin: 20,
    overflow: "hidden",
  },
  orchidContainer: {
    alignItems: "left",
    padding: 10,
  },
  orchidName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orchidImage: {
    width: 250,
    height: 150,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: "row", // Add flexDirection
    alignItems: "center", // Align items in the center
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
