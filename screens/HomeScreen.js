import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Pressable,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    const navigation = useNavigation();

    const fetchUsers = async (pageNum = 1, append = false) => {
        if (!append) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                console.warn('Token not found');
                return;
            }

            const response = await axios.get(
                'https://mobile.faveodemo.com/mudabir/public/v3/user-export-data',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        'roles[0]': 'user',
                        'roles[1]': 'agent',
                        'sort-order': 'desc',
                        limit: 10,
                        page: pageNum,
                    },
                }
            );

            const fetchedUsers = response.data?.data?.data || [];

            if (append) {
                setUsers(prev => [...prev, ...fetchedUsers]);
            } else {
                setUsers(fetchedUsers);
            }

            if (fetchedUsers.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const fetchUserById = async (userId) => {
        setLoading(true);
        setIsSearchMode(true);
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                console.warn('Token not found');
                return;
            }

            const response = await axios.get(
                `https://mobile.faveodemo.com/mudabir/public/v3/api/get-user/view/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = response.data?.data;
            if (user) {
                setUsers([user]);
                setHasMore(false);
            } else {
                setUsers([]);
                setHasMore(false);
            }

        } catch (error) {
            console.error('Error fetching user by ID:', error);
            setUsers([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Debounce searchQuery changes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim() === '') {
                setIsSearchMode(false);
                setPage(1);
                setHasMore(true);
                fetchUsers(1, false);
            } else {
                fetchUserById(searchQuery.trim());
            }
        }, 500); // wait 500ms after last keystroke

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const fetchMoreUsers = () => {
        if (isSearchMode || !hasMore || isFetchingMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUsers(nextPage, true);
    };

    const handleCardPress = (user) => {
        navigation.navigate('UserDetail', { user });
    };

    const navigateToAddPage = () => {
        navigation.navigate("Create User")
    }

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
                    <Image style={styles.profileImage}
                        source={{
                            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsyA44JdhHChP6kGqx36BolQq4Hn7z2yGekw&s"
                        }} />
                </View>
                <View>
                    <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.username}>@{item.username}</Text>
                </View>
            </View>
            <Text style={styles.desc}>Full Stack developer </Text>
            <View style={styles.followersFollowing}>
                <Text style={styles.follower}>
                    <Text style={styles.abc}>12</Text> Followers
                </Text>
                <Text style={styles.following}>
                    <Text style={styles.abc}>211</Text> Following
                </Text>
            </View>
        </Pressable>
    );

    const renderFooter = () =>
        isFetchingMore ? (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#555" />
            </View>
        ) : null;

    if (loading && users.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading users...</Text>
            </View>
        );
    }

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
                value={searchQuery}
                onChangeText={setSearchQuery}
                keyboardType="numeric"
            />

            <FlatList
                data={users}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={renderFooter}
                onEndReached={fetchMoreUsers}
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
        backgroundColor: '#f8f9fa',
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
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    // name: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#2c3e50',
    //     marginBottom: 4,
    // },
    // email: {
    //     fontSize: 14,
    //     color: '#555',
    //     marginBottom: 2,
    // },
    // role: {
    //     fontSize: 13,
    //     color: '#888',
    // },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
        transform: [{ scale: 0.98 }],
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
