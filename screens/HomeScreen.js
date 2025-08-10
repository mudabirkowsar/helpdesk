import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, ActivityIndicator,
    StyleSheet, TextInput, Pressable, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fetchUserById, fetchUsers, resetUsers } from '../services/redux/slices/userSlice';

const UserListScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { list: users, loading, hasMore, page, searchQuery } = useSelector((state) => state.user);

    const [searchText, setSearchText] = useState('');

    const followers = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
    const following = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

    // Initial fetch
    useEffect(() => {
        loadUsers(1);
    }, []);

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText.trim() === '') {
                dispatch(resetUsers());
                loadUsers(1);
            } else {
                loadUserById(searchText.trim());
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchText]);

    const loadUsers = async (pageNum) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        dispatch(fetchUsers({ token, page: pageNum }));
    };

    const loadMoreUsers = async () => {
        if (loading || !hasMore || searchQuery) return;
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        dispatch(fetchUsers({ token, page: page + 1, searchQuery }));
    };

    const loadUserById = async (id) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        dispatch(fetchUserById({ token, id }));
    };

    const handleCardPress = (user) => {
        navigation.navigate('UserDetail', { user });
    };

    const navigateToAddPage = () => {
        navigation.navigate('Create User');
    };

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => handleCardPress(item)}
            style={({ pressed }) => [
                styles.cardMainContainer,
                pressed && styles.cardPressed
            ]}
        >
            <View style={styles.imageAndTextView}>
                <View style={styles.imageView}>
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsyA44JdhHChP6kGqx36BolQq4Hn7z2yGekw&s"
                        }}
                    />
                </View>
                <View>
                    <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.username}>{item.email}</Text>
                </View>
            </View>
            <Text style={styles.desc}>Full Stack developer</Text>
            <View style={styles.followersFollowing}>
                <Text style={styles.follower}>
                    <Text style={styles.abc}>{followers}</Text> Followers
                </Text>
                <Text style={styles.following}>
                    <Text style={styles.abc}>{following}</Text> Following
                </Text>
            </View>
        </Pressable>
    );

    const renderFooter = () =>
        loading && hasMore ? (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#555" />
            </View>
        ) : null;

    return (
        <View style={styles.container}>
            <View style={styles.btnContainer}>
                <Pressable style={styles.addBtn} onPress={navigateToAddPage}>
                    <AntDesign name="adduser" color="#000" size={24} />
                </Pressable>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by User ID"
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
                keyboardType="numeric"
            />

            <FlatList
                data={users}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreUsers}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.center}>
                            <Text>No users found</Text>
                        </View>
                    )
                }
            />
        </View>
    );
};

export default UserListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    searchInput: {
        height: 48,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#ffffff',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 20,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    name: {
        fontSize: 23,
        fontWeight: "bold",
        marginBottom: 4,
        marginTop: 5
    },
    username: {
        fontSize: 16,
        color: "#0000007e"
    },
    desc: {
        fontSize: 17,
        color: "#0000007d",
        marginTop: 10,
        marginLeft: 10
    },
    follower: {
        fontSize: 16,
        marginLeft: 10
    },
    following: {
        fontSize: 16,
        marginLeft: 10
    },
    abc: {
        fontWeight: "bold"
    },
    cardMainContainer: {
        width: '100%',
        borderRadius: 20,
        marginBottom: 10,
        padding: 10,
        backgroundColor: "white",
        elevation: 1,
        transform: [{ scale: 1 }],
    },
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }]
    },
    imageAndTextView: {
        flexDirection: "row"
    },
    followersFollowing: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "90%",
        marginTop: 10,
    },
    imageView: {
        borderRadius: 100,
        marginRight: 10
    },
    profileImage: {
        height: 90,
        width: 90,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "green"
    },
    btnContainer: {
        alignItems: "flex-end"
    },
    addBtn: {
        width: 60,
        height: 60,
        borderRadius: 50,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#78dc78',
        position: "absolute",
        top: 700,
        right: 30,
        zIndex: 1000,
    },
});
