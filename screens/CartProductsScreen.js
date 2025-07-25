import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { removeFromCart } from './Redux/reduxotherfiles/action';

export default function CartProductsScreen() {
    const cartItems = useSelector((state) => state.reducer);
    const dispatch = useDispatch();

    const handleRemoveFromCart = (name) => {
        dispatch(removeFromCart(name));
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Icon name="cart" size={28} color="#333" style={styles.cartIcon} />
                <Text style={styles.heading}>Your Cart</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {cartItems.length === 0 ? (
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                ) : (
                    cartItems.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.details}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.description} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <Text style={styles.color}>Color: {item.color}</Text>
                                <Text style={styles.price}>₹{item.price}</Text>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveFromCart(item.name)}
                                >
                                    <Icon name="trash-outline" size={16} color="#fff" />
                                    <Text style={styles.buttonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {cartItems.length > 0 && (
                <View style={styles.checkoutBar}>
                    <View>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutText}>Checkout Now</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
        paddingTop:50,
    },
    cartIcon: {
        marginRight: 10,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 12,
        resizeMode: 'cover',
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 13,
        color: '#666',
        marginVertical: 4,
    },
    color: {
        fontSize: 13,
        color: '#999',
    },
    price: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2ecc71',
        marginTop: 4,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    checkoutBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        paddingBottom:30,
    },
    totalLabel: {
        fontSize: 14,
        color: '#888',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    checkoutText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
