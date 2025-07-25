import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Modal,
  TouchableOpacity
} from "react-native";
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";

const { height, width } = Dimensions.get("window");

function FloatingOrb({ style, delay, duration, size }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: size / 2,
          width: size,
          height: size,
          opacity: 0.7,
          transform: [{ translateY }],
        },
        style,
      ]}
    />
  );
}

export default function FrontPage({ navigation }) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");

  const requestPermissions = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        requestToken();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const requestToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log("Token", token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Foreground notification
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotifMessage(remoteMessage.notification?.body || "You have a new message!");
      setModalVisible(true);

      // Auto-dismiss after 5 seconds
      setTimeout(() => setModalVisible(false), 5000);
    });

    return unsubscribe;
  }, []);

  // Background notification tap handling
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen === "User") {
          setTimeout(() => {
            navigation.navigate("Todo");
          }, 1000);
        }
      });
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      {/* Floating Orbs */}
      <FloatingOrb size={80} style={{ top: height * 0.15, left: width * 0.1 }} delay={0} duration={4000} />
      <FloatingOrb size={50} style={{ top: height * 0.3, left: width * 0.7 }} delay={1500} duration={6000} />
      <FloatingOrb size={70} style={{ top: height * 0.5, left: width * 0.4 }} delay={3000} duration={5000} />
      <FloatingOrb size={40} style={{ top: height * 0.6, left: width * 0.2 }} delay={1000} duration={4500} />

      {/* Main content */}
      <View style={styles.glowCircle} />
      <View style={styles.glassCard}>
        <Text style={styles.title}>{t("frontpage.title")}</Text>
        <Text style={styles.subtitle}>{t("frontpage.subtitle")}</Text>
        <View style={styles.underline} />
      </View>

      {/* Custom Styled Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Notification</Text>
            <Text style={styles.modalMessage}>{notifMessage}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  glowCircle: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    top: height * 0.25,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 20,
    zIndex: 0,
  },
  glassCard: {
    width: "85%",
    paddingVertical: 30,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    zIndex: 1,
    ...Platform.select({
      ios: { backdropFilter: "blur(20px)" },
    }),
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.2,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#ddd",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  underline: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "tomato",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  closeBtn: {
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});
