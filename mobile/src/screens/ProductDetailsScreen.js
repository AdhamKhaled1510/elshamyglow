import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { t } from '../i18n';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const isRtl = lang === 'ar';

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const desc = lang === 'ar' ? product.description_ar : product.description_en;
  const images = JSON.parse(product.images || '[]');
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.imageSection}>
          <Image source={{ uri: images[selectedImage] }} style={styles.mainImage} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name={isRtl ? 'arrow-forward' : 'arrow-back'} size={24} color="#333" />
          </TouchableOpacity>
          {images.length > 1 && (
            <ScrollView horizontal style={styles.thumbRow} contentContainerStyle={styles.thumbContent}>
              {images.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImage(i)}
                  style={[styles.thumbWrap, selectedImage === i && styles.thumbActive]}
                >
                  <Image source={{ uri }} style={styles.thumb} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, isRtl && { textAlign: 'right' }]}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} ₪</Text>
            {product.stock > 0 ? (
              <View style={styles.inStock}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.stockText}>متوفر</Text>
              </View>
            ) : (
              <View style={styles.outOfStock}>
                <Ionicons name="close-circle" size={16} color="#ff4444" />
                <Text style={[styles.stockText, { color: '#ff4444' }]}>غير متوفر</Text>
              </View>
            )}
          </View>

          {desc && (
            <View style={styles.descSection}>
              <Text style={styles.sectionTitle}>{t('desc', lang) || 'Description'}</Text>
              <Text style={[styles.desc, isRtl && { textAlign: 'right' }]}>{desc}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>{t('total', lang)}</Text>
          <Text style={styles.totalPrice}>{product.price} ₪</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => { addItem(product); navigation.navigate('Cart'); }}>
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t('addToCart', lang)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageSection: { backgroundColor: '#f9f9f9' },
  mainImage: { width, height: width, resizeMode: 'cover' },
  backBtn: {
    position: 'absolute', top: 16, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
  },
  thumbRow: { marginTop: -20, marginBottom: 8 },
  thumbContent: { paddingHorizontal: 20, gap: 8 },
  thumbWrap: {
    width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  thumbActive: { borderColor: '#FF6B9D' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { padding: 20 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginVertical: 12,
  },
  price: { fontSize: 26, fontWeight: 'bold', color: '#FF6B9D' },
  inStock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stockText: { fontSize: 14, fontWeight: '500', color: '#4CAF50' },
  outOfStock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  descSection: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  desc: { fontSize: 15, color: '#666', lineHeight: 24 },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderTopWidth: 1, borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalLabel: { fontSize: 13, color: '#999' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#FF6B9D' },
  addBtn: {
    flexDirection: 'row', backgroundColor: '#FF6B9D',
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', gap: 8,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
