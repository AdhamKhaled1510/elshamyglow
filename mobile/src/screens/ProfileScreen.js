import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color="#fff" />
        </View>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF0F5' }]}>
              <Ionicons name="receipt-outline" size={22} color="#FF6B9D" />
            </View>
            <Text style={styles.menuText}>{t('myOrders', lang)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.langSection}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="language-outline" size={22} color="#4CAF50" />
            </View>
            <Text style={styles.menuText}>Language / اللغة</Text>
          </View>
          <View style={styles.langOptions}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
                onPress={() => setLang(l.code)}
              >
                <Text style={[styles.langBtnText, lang === l.code && styles.langBtnTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ff4444" />
        <Text style={styles.logoutText}>{t('logout', lang)}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  profileCard: {
    alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20,
    backgroundColor: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FF6B9D', justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: { alignItems: 'center' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  userEmail: { fontSize: 14, color: '#999', marginTop: 4 },
  menuSection: {
    backgroundColor: '#fff', borderRadius: 16, margin: 20, marginBottom: 0,
    padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  menuText: { fontSize: 16, fontWeight: '500', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },
  langSection: { paddingVertical: 12 },
  langOptions: { flexDirection: 'row', gap: 8, marginTop: 12, marginLeft: 54 },
  langBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  langBtnActive: { backgroundColor: '#FF6B9D' },
  langBtnText: { fontSize: 14, color: '#666', fontWeight: '500' },
  langBtnTextActive: { color: '#fff' },
  spacer: { flex: 1 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, margin: 20, marginTop: 0, marginBottom: 32,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#ffe0e0',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#ff4444' },
});
