import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/api_response.dart';
import '../models/bot_status.dart';

class ApiService {
  static const String _prefBaseUrlKey = 'api_base_url';
  static const String _prefApiKey = 'api_key';

  // Live Cloudflare Tunnel URL untuk bot di Pterodactyl
  String _baseUrl = 'https://base-api.ndichan.xyz';
  String _apiKey = 'ndika_secret_key_2026';

  String get baseUrl => _baseUrl;
  String get apiKey => _apiKey;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _baseUrl = prefs.getString(_prefBaseUrlKey) ?? _baseUrl;
    _apiKey = prefs.getString(_prefApiKey) ?? _apiKey;
  }

  Future<void> updateConfig({required String baseUrl, required String apiKey}) async {
    _baseUrl = baseUrl.trim().replaceAll(RegExp(r'/+$'), '');
    _apiKey = apiKey.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefBaseUrlKey, _baseUrl);
    await prefs.setString(_prefApiKey, _apiKey);
  }

  Map<String, String> _getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': _apiKey,
      'Authorization': 'Bearer $_apiKey',
    };
  }

  /// 1. GET /mySender
  Future<ApiResponse<BotStatus>> getBotStatus() async {
    final uri = Uri.parse('$_baseUrl/mySender?key=$_apiKey');
    final stopwatch = Stopwatch()..start();

    try {
      final response = await http
          .get(uri, headers: _getHeaders())
          .timeout(const Duration(seconds: 10));

      stopwatch.stop();
      final latency = stopwatch.elapsedMilliseconds;

      final dynamic decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          final botStatus = BotStatus.fromJson(
            decoded['data'] as Map<String, dynamic>? ?? {},
            latencyMs: latency,
          );
          return ApiResponse<BotStatus>(
            success: true,
            message: decoded['message'] as String? ?? 'Status berhasil diambil',
            data: botStatus,
          );
        } else {
          return ApiResponse<BotStatus>(
            success: false,
            message: decoded['message'] as String? ?? 'Gagal mengambil status bot',
            error: decoded['error'] != null
                ? ApiError.fromJson(decoded['error'] as Map<String, dynamic>)
                : ApiError(code: 'HTTP_${response.statusCode}'),
          );
        }
      }
      return ApiResponse<BotStatus>(
        success: false,
        message: 'Format respon server tidak valid',
        error: ApiError(code: 'INVALID_JSON_FORMAT'),
      );
    } on TimeoutException {
      stopwatch.stop();
      return ApiResponse<BotStatus>(
        success: false,
        message: 'Koneksi ke server timeout (10 detik). Periksa IP dan port.',
        error: ApiError(code: 'TIMEOUT'),
      );
    } catch (e) {
      stopwatch.stop();
      return ApiResponse<BotStatus>(
        success: false,
        message: 'Gagal terhubung ke API: $e',
        error: ApiError(code: 'NETWORK_ERROR', details: e.toString()),
      );
    }
  }

  /// 2. POST /getPairing
  Future<ApiResponse<Map<String, dynamic>>> requestPairingCode({
    required String phoneNumber,
    String customCode = 'NDIKA123',
  }) async {
    final uri = Uri.parse('$_baseUrl/getPairing?key=$_apiKey');
    final body = jsonEncode({
      'phoneNumber': phoneNumber.trim(),
      'customCode': customCode.trim(),
    });

    try {
      final response = await http
          .post(uri, headers: _getHeaders(), body: body)
          .timeout(const Duration(seconds: 25));

      final dynamic decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return ApiResponse<Map<String, dynamic>>(
            success: true,
            message: decoded['message'] as String? ?? 'Pairing code berhasil dibuat',
            data: decoded['data'] as Map<String, dynamic>?,
          );
        } else {
          return ApiResponse<Map<String, dynamic>>(
            success: false,
            message: decoded['message'] as String? ?? 'Gagal membuat pairing code',
            error: decoded['error'] != null
                ? ApiError.fromJson(decoded['error'] as Map<String, dynamic>)
                : ApiError(code: 'HTTP_${response.statusCode}'),
          );
        }
      }
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Format respon server tidak valid',
        error: ApiError(code: 'INVALID_RESPONSE'),
      );
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Koneksi error: $e',
        error: ApiError(code: 'REQUEST_FAILED', details: e.toString()),
      );
    }
  }

  /// 3. POST /deleteSender
  Future<ApiResponse<Map<String, dynamic>>> deleteSender() async {
    final uri = Uri.parse('$_baseUrl/deleteSender?key=$_apiKey');

    try {
      final response = await http
          .post(uri, headers: _getHeaders())
          .timeout(const Duration(seconds: 15));

      final dynamic decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return ApiResponse<Map<String, dynamic>>(
            success: true,
            message: decoded['message'] as String? ?? 'Sesi berhasil dihapus',
            data: decoded['data'] as Map<String, dynamic>?,
          );
        } else {
          return ApiResponse<Map<String, dynamic>>(
            success: false,
            message: decoded['message'] as String? ?? 'Gagal mereset sesi bot',
            error: decoded['error'] != null
                ? ApiError.fromJson(decoded['error'] as Map<String, dynamic>)
                : ApiError(code: 'HTTP_${response.statusCode}'),
          );
        }
      }
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Format respon server tidak valid',
        error: ApiError(code: 'INVALID_RESPONSE'),
      );
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Gagal mereset sesi: $e',
        error: ApiError(code: 'REQUEST_FAILED', details: e.toString()),
      );
    }
  }

  /// 4. POST /api/send-command
  Future<ApiResponse<Map<String, dynamic>>> sendCommand({
    required String target,
    String command = 'test-message',
    int count = 1,
    int delayMs = 1000,
  }) async {
    final uri = Uri.parse('$_baseUrl/api/send-command?key=$_apiKey');
    final body = jsonEncode({
      'target': target.trim(),
      'command': command,
      'count': count,
      'delayMs': delayMs,
    });

    try {
      final response = await http
          .post(uri, headers: _getHeaders(), body: body)
          .timeout(const Duration(seconds: 15));

      final dynamic decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return ApiResponse<Map<String, dynamic>>(
            success: true,
            message: decoded['message'] as String? ?? 'Perintah berhasil dikirim',
            data: decoded['data'] as Map<String, dynamic>?,
          );
        } else {
          return ApiResponse<Map<String, dynamic>>(
            success: false,
            message: decoded['message'] as String? ?? 'Gagal mengirim perintah',
            error: decoded['error'] != null
                ? ApiError.fromJson(decoded['error'] as Map<String, dynamic>)
                : ApiError(code: 'HTTP_${response.statusCode}'),
          );
        }
      }
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Format respon server tidak valid',
        error: ApiError(code: 'INVALID_RESPONSE'),
      );
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Gagal mengirim perintah: $e',
        error: ApiError(code: 'REQUEST_FAILED', details: e.toString()),
      );
    }
  }

  /// 5. GET /api/commands
  Future<List<dynamic>> getAvailableCommands() async {
    final uri = Uri.parse('$_baseUrl/api/commands?key=$_apiKey');
    try {
      final response = await http
          .get(uri, headers: _getHeaders())
          .timeout(const Duration(seconds: 8));

      final dynamic decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic> && decoded['success'] == true) {
        final data = decoded['data'] as Map<String, dynamic>?;
        if (data != null && data['commands'] is List) {
          return data['commands'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return [];
  }
}

