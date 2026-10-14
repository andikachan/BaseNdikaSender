import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/terminal_log.dart';
import '../models/bot_status.dart';

enum WsConnectionStatus { disconnected, connecting, connected }

class WebSocketService extends ChangeNotifier {
  static const int maxLogsInMemory = 200;

  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  Timer? _reconnectTimer;
  Timer? _heartbeatWatchdog;

  WsConnectionStatus _status = WsConnectionStatus.disconnected;
  WsConnectionStatus get status => _status;
  WsConnectionStatus get connectionStatus => _status;
  bool get isConnected => _status == WsConnectionStatus.connected;
  bool get isConnecting => _status == WsConnectionStatus.connecting;

  final List<TerminalLog> _logs = [];
  List<TerminalLog> get logs => List.unmodifiable(_logs);

  BotStatus? _latestBotStatus;
  BotStatus? get latestBotStatus => _latestBotStatus;

  Function(BotStatus status)? onStatusUpdated;

  int _reconnectAttempts = 0;
  bool _intentionalDisconnect = false;

  String _baseUrl = 'https://base-api.ndichan.xyz';
  String _apiKey = 'ndika_secret_key_2026';

  void configure({required String baseUrl, required String apiKey}) {
    _baseUrl = baseUrl;
    _apiKey = apiKey;
  }

  Uri _buildWsUri() {
    String wsBase = _baseUrl.trim();
    if (wsBase.startsWith('https://')) {
      wsBase = wsBase.replaceFirst('https://', 'wss://');
    } else if (wsBase.startsWith('http://')) {
      wsBase = wsBase.replaceFirst('http://', 'ws://');
    } else if (!wsBase.startsWith('ws://') && !wsBase.startsWith('wss://')) {
      wsBase = 'ws://$wsBase';
    }

    wsBase = wsBase.replaceAll(RegExp(r'/+$'), '');
    return Uri.parse('$wsBase/ws?key=$_apiKey');
  }

  void connect() {
    _intentionalDisconnect = false;
    _reconnectTimer?.cancel();

    if (_status == WsConnectionStatus.connected) return;

    _status = WsConnectionStatus.connecting;
    notifyListeners();

    try {
      final wsUri = _buildWsUri();
      addLog(TerminalLog.local(LogLevel.info, 'Menghubungkan ke WebSocket: $wsUri'));

      _channel = WebSocketChannel.connect(wsUri);

      _subscription = _channel!.stream.listen(
        (dynamic message) {
          _handleMessage(message);
        },
        onDone: () {
          _status = WsConnectionStatus.disconnected;
          notifyListeners();
          addLog(TerminalLog.local(LogLevel.warn, 'Koneksi WebSocket terputus dari server.'));
          if (!_intentionalDisconnect) {
            _scheduleReconnect();
          }
        },
        onError: (dynamic error) {
          _status = WsConnectionStatus.disconnected;
          notifyListeners();
          addLog(TerminalLog.local(LogLevel.error, 'WebSocket Error: $error'));
          if (!_intentionalDisconnect) {
            _scheduleReconnect();
          }
        },
        cancelOnError: true,
      );

      _status = WsConnectionStatus.connected;
      _reconnectAttempts = 0;
      notifyListeners();
      addLog(TerminalLog.local(LogLevel.success, 'WebSocket terhubung secara realtime.'));
      _resetHeartbeatWatchdog();
    } catch (e) {
      _status = WsConnectionStatus.disconnected;
      notifyListeners();
      addLog(TerminalLog.local(LogLevel.error, 'Gagal menginisialisasi WebSocket: $e'));
      if (!_intentionalDisconnect) {
        _scheduleReconnect();
      }
    }
  }

  void _handleMessage(dynamic rawMessage) {
    _resetHeartbeatWatchdog();

    try {
      final String stringMessage = rawMessage.toString();
      final Map<String, dynamic> json = jsonDecode(stringMessage) as Map<String, dynamic>;
      final String type = json['type'] as String? ?? 'log';

      if (type == 'heartbeat') {
        // Balas atau perbarui liveness
        _sendPong();
        return;
      }

      if (type == 'connection_status') {
        if (json['data'] != null && json['data'] is Map<String, dynamic>) {
          final botStatus = BotStatus.fromJson(json['data'] as Map<String, dynamic>);
          _latestBotStatus = botStatus;
          if (onStatusUpdated != null) {
            onStatusUpdated!(botStatus);
          }
          notifyListeners();
        }
        return;
      }

      if (type == 'command_started') {
        final data = json['data'] as Map<String, dynamic>?;
        final target = data?['target'] ?? '';
        final cmd = data?['command'] ?? '';
        addLog(TerminalLog(
          type: type,
          timestamp: DateTime.now(),
          level: LogLevel.info,
          message: '⚡ [COMMAND STARTED] Perintah $cmd ke $target sedang dieksekusi...',
          data: data,
        ));
        return;
      }

      if (type == 'command_completed') {
        final data = json['data'] as Map<String, dynamic>?;
        final total = data?['totalSent'] ?? '';
        addLog(TerminalLog(
          type: type,
          timestamp: DateTime.now(),
          level: LogLevel.success,
          message: '✔ [COMMAND COMPLETED] Selesai: $total pesan pengujian sukses terkirim.',
          data: data,
        ));
        return;
      }

      if (type == 'command_failed') {
        final data = json['data'] as Map<String, dynamic>?;
        final err = data?['error'] ?? 'Unknown error';
        addLog(TerminalLog(
          type: type,
          timestamp: DateTime.now(),
          level: LogLevel.error,
          message: '✖ [COMMAND FAILED] Eksekusi gagal: $err',
          data: data,
        ));
        return;
      }

      // Default: parse sebagai TerminalLog
      final logItem = TerminalLog.fromJson(json);
      addLog(logItem);
    } catch (e) {
      addLog(TerminalLog.local(LogLevel.warn, 'Data log tidak valid: $rawMessage'));
    }
  }

  void _sendPong() {
    if (_channel != null && _status == WsConnectionStatus.connected) {
      try {
        _channel!.sink.add(jsonEncode({'type': 'pong', 'timestamp': DateTime.now().toIso8601String()}));
      } catch (_) {}
    }
  }

  void _resetHeartbeatWatchdog() {
    _heartbeatWatchdog?.cancel();
    // Jika tidak ada pesan atau heartbeat dalam 45 detik, anggap dead connection dan reconnect
    _heartbeatWatchdog = Timer(const Duration(seconds: 45), () {
      if (_status == WsConnectionStatus.connected && !_intentionalDisconnect) {
        addLog(TerminalLog.local(LogLevel.warn, 'Heartbeat watchdog timeout (45s). Merestart koneksi...'));
        disconnect();
        _scheduleReconnect();
      }
    });
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectAttempts++;

    // Exponential backoff: 2s, 4s, 8s, 16s, max 30s
    final delaySeconds = min(pow(2, _reconnectAttempts).toInt(), 30);
    addLog(TerminalLog.local(
      LogLevel.warn,
      'Menjadwalkan reconnect otomatis dalam $delaySeconds detik (Percobaan #$_reconnectAttempts)...',
    ));

    _reconnectTimer = Timer(Duration(seconds: delaySeconds), () {
      if (!_intentionalDisconnect) {
        connect();
      }
    });
  }

  void addLog(TerminalLog log) {
    _logs.add(log);
    if (_logs.length > maxLogsInMemory) {
      _logs.removeRange(0, _logs.length - maxLogsInMemory);
    }
    notifyListeners();
  }

  void clearLogs() {
    _logs.clear();
    addLog(TerminalLog.local(LogLevel.info, 'Tampilan terminal console dibersihkan.'));
    notifyListeners();
  }

  void disconnect() {
    _intentionalDisconnect = true;
    _reconnectTimer?.cancel();
    _heartbeatWatchdog?.cancel();
    _subscription?.cancel();
    _channel?.sink.close();
    _channel = null;
    _status = WsConnectionStatus.disconnected;
    notifyListeners();
  }

  void reconnect() {
    disconnect();
    _intentionalDisconnect = false;
    _reconnectAttempts = 0;
    connect();
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}
