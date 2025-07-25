import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './reduxotherfiles/action'; // Update path if needed

export default function Product({ item }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.reducer);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const exists = cartItems.some((cartItem) => cartItem.name === item.name);
    setIsAdded(exists);
  }, [cartItems]);

  const handleCardPress = () => {
    Alert.alert("Card pressed");
    // navigation.navigate('ProductDetail', { product: item });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    Alert.alert('Buy Now', `Buying: ${item.name}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    setIsAdded(true); // ✅ Make sure the UI updates immediately
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    dispatch(removeFromCart(item.name));
    setIsAdded(false);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.color}>Color: {item.color}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Icon name="bag-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>

          {
            isAdded ? (
              <TouchableOpacity style={styles.addButton} onPress={handleRemoveFromCart}>
                <Icon name="cart-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <Icon name="cart-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
    flexShrink: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  color: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    flexWrap: 'nowrap',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    maxWidth: 110,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6f61',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
    maxWidth: 110,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
