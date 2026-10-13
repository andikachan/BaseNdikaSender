import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class UserAccount {
  final String username;
  final String role;
  final DateTime expiredDate;
  final bool isVip;

  UserAccount({
    required this.username,
    required this.role,
    required this.expiredDate,
    this.isVip = true,
  });

  bool get isExpired => DateTime.now().isAfter(expiredDate);

  int get remainingDays {
    final diff = expiredDate.difference(DateTime.now()).inDays;
    return diff > 0 ? diff : 0;
  }

  String get formattedExpiry {
    return '${expiredDate.day.toString().padLeft(2, '0')}/${expiredDate.month.toString().padLeft(2, '0')}/${expiredDate.year}';
  }

  Map<String, dynamic> toJson() => {
        'username': username,
        'role': role,
        'expiredDate': expiredDate.toIso8601String(),
        'isVip': isVip,
      };

  factory UserAccount.fromJson(Map<String, dynamic> json) => UserAccount(
        username: json['username'] as String? ?? 'User',
        role: json['role'] as String? ?? 'VIP SENDER',
        expiredDate: DateTime.tryParse(json['expiredDate'] as String? ?? '') ??
            DateTime(2026, 12, 31),
        isVip: json['isVip'] as bool? ?? true,
      );
}

class AuthService {
  static const String _keyUserSession = 'ndika_user_session';
  static const String _keyIsLoggedIn = 'ndika_is_logged_in';

  static UserAccount? _currentUser;

  static UserAccount? get currentUser => _currentUser;

  /// Inisialisasi status autentikasi dari penyimpanan lokal
  static Future<bool> init() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(_keyIsLoggedIn) ?? false;
    final sessionJson = prefs.getString(_keyUserSession);

    if (isLoggedIn && sessionJson != null) {
      try {
        final decoded = jsonDecode(sessionJson) as Map<String, dynamic>;
        _currentUser = UserAccount.fromJson(decoded);

        if (_currentUser!.isExpired) {
          return false;
        }
        return true;
      } catch (_) {
        return false;
      }
    }
    return false;
  }

  /// Verifikasi Login Akun & Lisensi
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final cleanUser = username.trim();
    final cleanPass = password.trim();

    if (cleanUser.isEmpty || cleanPass.isEmpty) {
      return {
        'success': false,
        'message': 'Username dan password wajib diisi.',
      };
    }

    // Daftar Akun & Lisensi Sistem (Format NEX VIP)
    // Mendukung akun default 'ndika' / 'ndika', 'admin' / 'admin2026', atau key lisensi
    final validAccounts = <String, Map<String, dynamic>>{
      'ndika': {
        'password': 'ndika',
        'role': 'OWNER VIP',
        'expiredDate': DateTime(2027, 1, 1),
      },
      'admin': {
        'password': 'admin',
        'role': 'ADMINISTRATOR',
        'expiredDate': DateTime(2026, 12, 31),
      },
      'vip': {
        'password': 'vip',
        'role': 'VIP SENDER',
        'expiredDate': DateTime(2026, 12, 31),
      },
      'user': {
        'password': 'user',
        'role': 'MEMBER',
        'expiredDate': DateTime.now().add(const Duration(days: 30)),
      },
    };

    DateTime expiry;
    String role;

    if (validAccounts.containsKey(cleanUser.toLowerCase())) {
      final acc = validAccounts[cleanUser.toLowerCase()]!;
      if (acc['password'] != cleanPass) {
        return {
          'success': false,
          'message': 'Password yang Anda masukkan salah.',
        };
      }
      role = acc['role'] as String;
      expiry = acc['expiredDate'] as DateTime;
    } else if (cleanPass == 'ndika2026' || cleanPass == 'spider' || cleanPass == 'nex') {
      // Akses Master Key / Lisensi Khusus
      role = 'VIP SENDER';
      expiry = DateTime(2026, 12, 31);
    } else {
      return {
        'success': false,
        'message': 'Username atau lisensi tidak terdaftar.',
      };
    }

    // Cek apakah akun kedaluwarsa
    if (DateTime.now().isAfter(expiry)) {
      return {
        'success': false,
        'message': 'AKUN EXPIRED: Masa aktif akun Anda telah kedaluwarsa.',
      };
    }

    final account = UserAccount(
      username: cleanUser.toUpperCase(),
      role: role,
      expiredDate: expiry,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsLoggedIn, true);
    await prefs.setString(_keyUserSession, jsonEncode(account.toJson()));
    _currentUser = account;

    return {
      'success': true,
      'message': 'Login berhasil. Selamat datang $cleanUser.',
      'account': account,
    };
  }

  /// Keluar dari sesi
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsLoggedIn, false);
    await prefs.remove(_keyUserSession);
    _currentUser = null;
  }
}
