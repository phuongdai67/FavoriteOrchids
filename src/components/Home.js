import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import { getOrchids } from "../api/axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [orchids, setOrchids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedOrchids, setLikedOrchids] = useState([]);
  const navigation = useNavigation();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const orchidsData = await getOrchids(selectedCategory);
      let filteredOrchidsData = orchidsData;
      if (selectedCategory) {
        filteredOrchidsData = orchidsData.filter(
          (orchid) => orchid.category === selectedCategory
        );
      }
      setOrchids(filteredOrchidsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const updateSearch = (search) => {
    setSearch(search);

    // Nếu search không rỗng, lọc danh sách hoa dựa trên tên
    if (search !== "") {
      const filteredOrchids = orchids.filter((orchid) =>
        orchid.name.toLowerCase().includes(search.toLowerCase())
      );
      setOrchids(filteredOrchids);
    } else {
      // Nếu search rỗng, gọi hàm fetchData để lấy tất cả dữ liệu hoa
      fetchData();
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleToggleLike = async (orchid) => {
    try {
      // Kiểm tra xem hoa đã được thích trước đó chưa
      const isLiked = likedOrchids.some(
        (likedOrchid) => likedOrchid.id === orchid.id
      );
      let updatedLikedOrchids = [];

      if (isLiked) {
        // Nếu đã thích, loại bỏ hoa khỏi danh sách yêu thích
        updatedLikedOrchids = likedOrchids.filter(
          (likedOrchid) => likedOrchid.id !== orchid.id
        );
      } else {
        // Nếu chưa thích, thêm hoa vào danh sách yêu thích
        updatedLikedOrchids = [...likedOrchids, orchid];
      }

      // Cập nhật state và lưu trạng thái vào AsyncStorage
      setLikedOrchids(updatedLikedOrchids);
      await AsyncStorage.setItem(
        "likedOrchids",
        JSON.stringify(updatedLikedOrchids)
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  // Cập nhật trạng thái dislike sau khi trở về từ Favorite Screen
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

  return (
    <View style={styles.container}>
      <View>
        <View>
          <TouchableWithoutFeedback onPress={() => selectCategory(null)}>
            <View style={{ ...styles.diffButton, marginLeft: 150 }}>
              <Text style={styles.categoryText}>Tất cả</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          <TouchableWithoutFeedback onPress={() => selectCategory("Địa Lan")}>
            <View style={styles.categoryButton}>
              <ImageBackground
                source={{
                  uri: "https://cdn.tgdd.vn/Files/2021/07/23/1370252/cach-trong-y-nghia-va-nhung-su-that-thu-vi-ve-cay-hoa-dia-lan-202107231044053239.jpg",
                }}
                style={{
                  ...styles.categoryImage,
                  width: "100%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Text style={{ ...styles.categoryText, fontWeight: 600 }}>
                  Địa Lan
                </Text>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => selectCategory("Phong Lan")}>
            <View style={styles.categoryButton}>
              <ImageBackground
                source={{
                  uri: "https://vuonsaigon.vn/wp-content/uploads/2021/09/lan-phi-diep-tim.png",
                }}
                style={{
                  ...styles.categoryImage,
                  width: "100%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Text style={{ ...styles.categoryText, fontWeight: 600 }}>
                  Phong Lan
                </Text>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => selectCategory("Bán Địa Lan")}
          >
            <View style={styles.categoryButton}>
              <ImageBackground
                source={{
                  uri: "http://camnangcaytrong.com/Uploads/UserFiles/images/Cymbidium_Ruby_Valley_'Clare'%20(1).jpg",
                }}
                style={{
                  ...styles.categoryImage,
                  width: "100%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Text style={{ ...styles.categoryText, fontWeight: 600 }}>
                  Bán Địa Lan
                </Text>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={updateSearch}
            value={search}
            placeholder="Tìm loài hoa yêu thích ở đây"
          />
        </View>
        {orchids.map((orchid) => (
          <View key={orchid.id} style={styles.itemContainer}>
            <Text style={{ ...styles.itemText, textAlign: "left" }}>
              {orchid.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Detail", { id: orchid.id });
              }}
            >
              <Image source={{ uri: orchid.image }} style={styles.itemImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleToggleLike(orchid)}>
              <View style={styles.favoriteContainer}>
                <Ionicons
                  name={
                    likedOrchids.some(
                      (likedOrchid) => likedOrchid.id === orchid.id
                    )
                      ? "heart"
                      : "heart-outline"
                  }
                  size={40}
                  color={
                    likedOrchids.some(
                      (likedOrchid) => likedOrchid.id === orchid.id
                    )
                      ? "#db1c07"
                      : "grey"
                  }
                  style={styles.heartIcon}
                />
                <Text
                  style={[
                    styles.favoriteText,
                    {
                      color: likedOrchids.some(
                        (likedOrchid) => likedOrchid.id === orchid.id
                      )
                        ? "#db1c07"
                        : "grey",
                    },
                  ]}
                >
                  Yêu Thích
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 0 }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Màu nền trắng
  },
  searchContainer: {
    marginTop: 10,
    padding: 10,
    marginLeft: 50,
    borderRadius: 20,
    width: "80%",
  },
  searchInput: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    padding: 10,
  },
  categoryButton: {
    width: 159,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8C8EA3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 18,
  },
  categoryImage: {
    flex: 1,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  diffButton: {
    width: 110,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8C8EA3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#8C8EA3",
    marginTop: 18,
    marginTop: 50,
  },
  scrollViewContent: {
    alignItems: "center", // căn giữa theo chiều ngang
    justifyContent: "flex-start", // căn giữa theo chiều dọc
  },
  itemContainer: {
    // alignItems: "center",
    marginBottom: 50,
    marginTop: 25,
  },
  itemText: {
    fontSize: 20,
    marginBottom: 10, // Khoảng cách giữa văn bản và hình ảnh
    fontWeight: 800,
  },
  itemImage: {
    width: 400,
    height: 170,
    borderRadius: 13,
  },
  favoriteContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteText: {
    fontSize: 18,
    marginLeft: 5,
  },
});
