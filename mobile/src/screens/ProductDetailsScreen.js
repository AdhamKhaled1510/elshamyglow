import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { t } from '../i18n';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const isRtl = lang === 'ar';

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const desc = lang === 'ar' ? product.description_ar : product.description_en;
  const images = JSON.parse(product.images || '[]');

  return (
    <ScrollView style={[styles.container]}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons
          name={isRtl ? 'arrow-forward' : 'arrow-back'}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {images[0] ? (
          <Image source={{ uri: images[0] }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={80} color="#ddd" />
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, isRtl && { textAlign: 'right' }]}>
          {name}
        </Text>
        <Text style={styles.price}>{product.price} ₪</Text>
        {desc && (
          <Text style={[styles.desc, isRtl && { textAlign: 'right' }]}>
            {desc}
          </Text>
        )}
        <Text style={[styles.stock, isRtl && { textAlign: 'right' }]}>
          {product.stock > 0 ? 'متوفر' : 'غير متوفر'}
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            addItem(product);
            navigation.navigate('Cart');
          }}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t('addToCart', lang)}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { padding: 16, position: 'absolute', top: 0, left: 0, zIndex: 10 },
  imageContainer: {
    height: 300,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 22, fontWeight: 'bold', color: '#FF6B9D', marginVertical: 8 },
  desc: { fontSize: 16, color: '#666', lineHeight: 24 },
  stock: { fontSize: 14, color: '#4CAF50', marginVertical: 8 },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 8 },
});
