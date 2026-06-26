import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { t, LANGUAGES } from '../i18n';

export default function ProfileScreen({ navigation }) {
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Language / اللغة
        </Text>
        {LANGUAGES.map((l) => (
          <TouchableOpacity
            key={l.code}
            style={[
              styles.langOption,
              lang === l.code && styles.langActive,
            ]}
            onPress={() => setLang(l.code)}
          >
            <Ionicons
              name={
                lang === l.code ? 'radio-button-on' : 'radio-button-off'
              }
              size={20}
              color="#FF6B9D"
            />
            <Text style={styles.langText}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.ordersBtn}
        onPress={() => navigation.navigate('Orders')}
      >
        <Ionicons name="receipt-outline" size={22} color="#FF6B9D" />
        <Text style={styles.ordersBtnText}>{t('myOrders', lang)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ff4444" />
        <Text style={styles.logoutText}>{t('logout', lang)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: { width: '100%' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#999', marginTop: 4 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 12 },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  langActive: {},
  langText: { marginLeft: 12, fontSize: 16, color: '#333' },
  ordersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ordersBtnText: { marginLeft: 12, fontSize: 16, color: '#FF6B9D', fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: { marginLeft: 12, fontSize: 16, color: '#ff4444', fontWeight: '600' },
});
