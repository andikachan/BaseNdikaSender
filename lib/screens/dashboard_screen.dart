import 'dart:async';
import 'package:flutter/material.dart';
import '../models/bot_status.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import '../theme/app_theme.dart';
import '../widgets/status_card.dart';
import '../widgets/terminal_console.dart';
import '../widgets/pairing_dialog.dart';
import '../widgets/command_dialog.dart';

class DashboardScreen extends StatefulWidget {
  final ApiService apiService;
  final WebSocketService wsService;

  const DashboardScreen({
    Key? key,
    required this.apiService,
    required this.wsService,
  }) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  BotStatus _botStatus = BotStatus.initial();
  bool _isRefreshing = false;
  Timer? _periodicRefreshTimer;

  @override
  void initState() {
    super.initState();
    _initServices();
  }

  void _initServices() {
    // Sambungkan WebSocket
    widget.wsService.configure(
      baseUrl: widget.apiService.baseUrl,
      apiKey: widget.apiService.apiKey,
    );
    widget.wsService.onStatusUpdated = (status) {
      if (mounted) {
        setState(() {
          _botStatus = status;
        });
      }
    };
    widget.wsService.connect();

    // Muat status awal via REST API
    _fetchBotStatus();

    // Refresh berkala setiap 15 detik
    _periodicRefreshTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _fetchBotStatus(silent: true);
    });
  }

  @override
  void dispose() {
    _periodicRefreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchBotStatus({bool silent = false}) async {
    if (!silent) {
      setState(() => _isRefreshing = true);
    }

    final response = await widget.apiService.getBotStatus();

    if (mounted) {
      setState(() {
        if (!silent) _isRefreshing = false;
        if (response.success && response.data != null) {
          _botStatus = response.data!;
        }
      });
    }
  }

  Future<void> _handleResetSession() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppTheme.neonRed),
        ),
        title: const Row(
          children: [
            Icon(Icons.delete_forever, color: AppTheme.neonRed, size: 22),
            SizedBox(width: 8),
            Text(
              'HAPUS SESI BOT?',
              style: TextStyle(color: AppTheme.neonRed, fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: const Text(
          'Tindakan ini akan menghentikan koneksi aktif, menghapus kredensial login di server, dan merestart bot. Anda harus melakukan pairing ulang.',
          style: TextStyle(color: AppTheme.textLight, fontSize: 12),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.neonRed, foregroundColor: Colors.white),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('HAPUS & RESTART'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Mengirim permintaan reset sesi...')),
    );

    final res = await widget.apiService.deleteSender();
    if (mounted) {
      if (res.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Sesi berhasil dihapus. Bot sedang di-restart...'),
            backgroundColor: Colors.green,
          ),
        );
        _fetchBotStatus();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal reset sesi: ${res.message}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _openSettingsDialog() {
    final urlController = TextEditingController(text: widget.apiService.baseUrl);
    final keyController = TextEditingController(text: widget.apiService.apiKey);

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        side: BorderSide(color: AppTheme.neonCyan, width: 1.2),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.settings, color: AppTheme.neonCyan, size: 20),
                SizedBox(width: 8),
                Text(
                  'SERVER API CONFIGURATION',
                  style: TextStyle(color: AppTheme.neonCyan, fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 14),
            const Text('BASE URL (HTTP / HTTPS):', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
            const SizedBox(height: 6),
            TextField(
              controller: urlController,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(hintText: 'http://10.0.2.2:25566 atau https://bot.domain.com'),
            ),
            const SizedBox(height: 12),
            const Text('API KEY (SECRET TOKEN):', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
            const SizedBox(height: 6),
            TextField(
              controller: keyController,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(hintText: 'ndika_secret_key_2026'),
            ),
            const SizedBox(height: 18),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () async {
                    await widget.apiService.updateConfig(
                      baseUrl: urlController.text,
                      apiKey: keyController.text,
                    );
                    widget.wsService.disconnect();
                    widget.wsService.configure(
                      baseUrl: widget.apiService.baseUrl,
                      apiKey: widget.apiService.apiKey,
                    );
                    widget.wsService.connect();
                    if (mounted) {
                      Navigator.of(ctx).pop();
                      _fetchBotStatus();
                    }
                  },
                  child: const Text('SIMPAN & HUBUNGKAN'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.bolt, color: AppTheme.neonCyan, size: 20),
            SizedBox(width: 6),
            Text('NDIKA BOT DASHBOARD'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, color: AppTheme.neonCyan),
            onPressed: _openSettingsDialog,
            tooltip: 'Server Settings',
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              // 1. Status Card
              StatusCard(
                status: _botStatus,
                isRefreshing: _isRefreshing,
                onRefresh: _fetchBotStatus,
              ),
              const SizedBox(height: 12),

              // 2. Control Action Bar
              Row(
                children: [
                  // Pairing Button
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.surfaceDark,
                        foregroundColor: AppTheme.neonCyan,
                        side: const BorderSide(color: AppTheme.neonCyan),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.qr_code, size: 16),
                      label: const Text('PAIRING', style: TextStyle(fontSize: 11)),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (_) => PairingDialog(
                            apiService: widget.apiService,
                            onSuccess: _fetchBotStatus,
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Reset Session Button
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.surfaceDark,
                        foregroundColor: AppTheme.neonRed,
                        side: const BorderSide(color: AppTheme.neonRed),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.refresh, size: 16),
                      label: const Text('RESET SESI', style: TextStyle(fontSize: 11)),
                      onPressed: _handleResetSession,
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Test Command Button
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.surfaceDark,
                        foregroundColor: AppTheme.neonGreen,
                        side: const BorderSide(color: AppTheme.neonGreen),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.send, size: 16),
                      label: const Text('TEST MSG', style: TextStyle(fontSize: 11)),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (_) => CommandDialog(
                            apiService: widget.apiService,
                            onCommandSent: _fetchBotStatus,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // 3. Realtime Terminal Console
              Expanded(
                child: AnimatedBuilder(
                  animation: widget.wsService,
                  builder: (context, _) {
                    return TerminalConsole(
                      logs: widget.wsService.logs,
                      wsStatus: widget.wsService.status,
                      onClear: widget.wsService.clearLogs,
                      onReconnect: widget.wsService.connect,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
