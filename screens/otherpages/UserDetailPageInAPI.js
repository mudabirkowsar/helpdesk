import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';

const UserDetailPageInAPI = ({ route }) => {
  const { user } = route.params;

  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34" }}
        resizeMode="cover"
        style={styles.bgImage}
      >
        <View style={styles.imageView}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://randomuser.me/api/portraits/women/8.jpg"}}
          />
        </View>
      </ImageBackground>

      <View style={styles.detailMainContainer}>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.username}>@{user.email}</Text>
        <Text style={styles.desc}>Full Stack developer</Text>

        <View style={styles.followersFollowing}>
          <Text style={styles.follower}>
            <Text style={styles.abc}>11</Text> Followers
          </Text>
          <Text style={styles.following}>
            <Text style={styles.abc}>232</Text> Following
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location</Text>
          <Text style={styles.sectionText}>San Francisco, California</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Bio</Text>
          <Text style={styles.sectionText}>
            Passionate full-stack developer with a love for clean UI and scalable architecture.
            Building innovative digital experiences one line of code at a time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Interests</Text>
          <Text style={styles.sectionText}>React, Node.js, Open Source, Coffee, UI Design</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetailPageInAPI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  bgImage: {
    height: 220,
    width: "100%",
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  imageView: {
    alignItems: 'center',
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
  },
  detailMainContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  username: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  followersFollowing: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  follower: {
    fontSize: 16,
  },
  following: {
    fontSize: 16,
  },
  abc: {
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
  },
});
