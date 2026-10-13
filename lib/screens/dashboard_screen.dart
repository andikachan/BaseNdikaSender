import 'dart:async';
import 'package:flutter/material.dart';
import '../models/bot_status.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/websocket_service.dart';
import '../theme/app_theme.dart';
import '../widgets/status_card.dart';
import '../widgets/terminal_console.dart';
import '../widgets/pairing_dialog.dart';
import '../widgets/command_dialog.dart';

class DashboardScreen extends StatefulWidget {
  final ApiService apiService;
  final WebSocketService wsService;
  final VoidCallback onLogout;

  const DashboardScreen({
    Key? key,
    required this.apiService,
    required this.wsService,
    required this.onLogout,
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
          'Koneksi bot WhatsApp saat ini akan dihentikan, folder session dibersihkan, dan instance Baileys diinisialisasi ulang.',
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
            child: const Text('HAPUS & RESET'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      setState(() => _isRefreshing = true);
      final res = await widget.apiService.deleteSender();
      if (mounted) {
        setState(() => _isRefreshing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: res.success ? AppTheme.neonGreen : AppTheme.neonRed,
            content: Text(res.message, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        );
        _fetchBotStatus();
      }
    }
  }

  void _showPairingDialog() {
    showDialog(
      context: context,
      builder: (ctx) => PairingDialog(
        apiService: widget.apiService,
        onSuccess: () => _fetchBotStatus(),
      ),
    );
  }

  void _showCommandDialog() {
    showDialog(
      context: context,
      builder: (ctx) => CommandDialog(
        apiService: widget.apiService,
        onCommandSent: () => _fetchBotStatus(),
      ),
    );
  }

  void _showSettingsDialog() {
    final urlController = TextEditingController(text: widget.apiService.baseUrl);
    final keyController = TextEditingController(text: widget.apiService.apiKey);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppTheme.neonCyan),
        ),
        title: const Row(
          children: [
            Icon(Icons.settings, color: AppTheme.neonCyan, size: 20),
            SizedBox(width: 8),
            Text(
              'PENGATURAN SERVER API',
              style: TextStyle(color: AppTheme.neonCyan, fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('URL SERVER / TUNNEL', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
            const SizedBox(height: 4),
            TextField(
              controller: urlController,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: const InputDecoration(hintText: 'https://botapi.ndichan.xyz'),
            ),
            const SizedBox(height: 12),
            const Text('API SECRET KEY', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
            const SizedBox(height: 4),
            TextField(
              controller: keyController,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: const InputDecoration(hintText: 'ndika_secret_key_2026'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.neonCyan, foregroundColor: Colors.black),
            onPressed: () async {
              await widget.apiService.updateConfig(
                baseUrl: urlController.text,
                apiKey: keyController.text,
              );
              Navigator.of(ctx).pop();
              _initServices();
            },
            child: const Text('SIMPAN'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFF080B10),
      body: Stack(
        children: [
          // Background Image Layer (Style NEX_VOID_SPIDER)
          Positioned.fill(
            child: Opacity(
              opacity: 0.18,
              child: Image.asset(
                'assets/bgdashboard.png',
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox(),
              ),
            ),
          ),

          // Main Layout
          SafeArea(
            child: Column(
              children: [
                // Custom App Bar Header
                _buildHeader(user),

                // Scrollable Content
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: () => _fetchBotStatus(),
                    color: AppTheme.neonCyan,
                    backgroundColor: AppTheme.surfaceDark,
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // 1. BANNER TOOLS SECTION (Seperti NEX_VOID_SPIDER)
                          _buildBannerSection(),
                          const SizedBox(height: 14),

                          // 2. ACCOUNT & LICENSE EXPIRY BAR
                          if (user != null) ...[
                            _buildExpiryInfoBar(user),
                            const SizedBox(height: 14),
                          ],

                          // 3. BOT CONNECTION STATUS CARD
                          StatusCard(
                            status: _botStatus,
                            isRefreshing: _isRefreshing,
                            onRefresh: () => _fetchBotStatus(),
                          ),
                          const SizedBox(height: 14),

                          // 4. ACTION CONTROLS (TOMBOL OPERASI)
                          _buildActionControls(),
                          const SizedBox(height: 14),

                          // 5. LIVE TERMINAL CONSOLE
                          TerminalConsole(
                            logs: widget.wsService.logs,
                            wsStatus: widget.wsService.connectionStatus,
                            onClear: () => widget.wsService.clearLogs(),
                            onReconnect: () => widget.wsService.reconnect(),
                          ),
                          const SizedBox(height: 24),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(UserAccount? user) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Color(0xFF0D121B),
        border: Border(bottom: BorderSide(color: Color(0xFF1E2838), width: 1.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppTheme.neonCyan, width: 1.2),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(5),
                  child: Image.asset(
                    'assets/images/logo.png',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Icon(
                      Icons.shield_outlined,
                      color: AppTheme.neonCyan,
                      size: 18,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'NDIKA SENDER VIP',
                    style: TextStyle(
                      fontFamily: 'Astral',
                      color: AppTheme.neonCyan,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    user != null ? '${user.username} • ${user.role}' : 'CONNECTED TO SERVER',
                    style: const TextStyle(
                      color: AppTheme.textMuted,
                      fontSize: 10,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.settings_outlined, color: AppTheme.textMuted, size: 20),
                onPressed: _showSettingsDialog,
                tooltip: 'Pengaturan API',
              ),
              IconButton(
                icon: const Icon(Icons.logout, color: AppTheme.neonRed, size: 20),
                onPressed: widget.onLogout,
                tooltip: 'Keluar',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBannerSection() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.neonCyan.withOpacity(0.6), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: AppTheme.neonCyan.withOpacity(0.2),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(9),
        child: Stack(
          children: [
            // Banner Image from assets (bannertools.jpg)
            Image.asset(
              'assets/bannertools.jpg',
              height: 140,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                height: 140,
                color: const Color(0xFF131A26),
                child: const Center(
                  child: Text(
                    'NDIKA SENDER PROTOCOL',
                    style: TextStyle(
                      fontFamily: 'Astral',
                      color: AppTheme.neonCyan,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),

            // Gradient Overlay
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.85),
                    ],
                  ),
                ),
              ),
            ),

            // Banner Overlay Text Info
            Positioned(
              left: 14,
              bottom: 12,
              right: 14,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'NEX VOID SPIDER PROTOCOL',
                        style: TextStyle(
                          fontFamily: 'Astral',
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Automated Baileys Socket Engine • 39 Functions',
                        style: TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.neonCyan.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: AppTheme.neonCyan, width: 0.8),
                    ),
                    child: const Text(
                      'READY',
                      style: TextStyle(
                        fontFamily: 'Astral',
                        color: AppTheme.neonCyan,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpiryInfoBar(UserAccount user) {
    final isExp = user.isExpired;
    final color = isExp ? AppTheme.neonRed : AppTheme.neonGreen;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF101622),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.4), width: 1.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.vpn_key_outlined, size: 16, color: color),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'LISENSI: ${user.username} (${user.role})',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                    ),
                  ),
                  Text(
                    'EXPIRED: ${user.formattedExpiry} (${user.remainingDays} HARI TERSISA)',
                    style: TextStyle(
                      color: color,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: color, width: 0.8),
            ),
            child: Text(
              isExp ? 'EXPIRED' : 'ACTIVE',
              style: TextStyle(
                fontFamily: 'Astral',
                color: color,
                fontSize: 9,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionControls() {
    return Column(
      children: [
        // Baris Tombol 1: Send Command & Pairing Code
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.neonCyan,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                ),
                onPressed: _showCommandDialog,
                icon: const Icon(Icons.flash_on, size: 18),
                label: const Text(
                  'FUNGSI SENDER (39)',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.8),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.neonCyan, width: 1.2),
                  foregroundColor: AppTheme.neonCyan,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                ),
                onPressed: _showPairingDialog,
                icon: const Icon(Icons.qr_code_2, size: 18),
                label: const Text(
                  'PAIRING CODE',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.8),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Baris Tombol 2: Reset Session
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Color(0xFF2E3A4E), width: 1.0),
              foregroundColor: AppTheme.textMuted,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
            ),
            onPressed: _handleResetSession,
            icon: const Icon(Icons.refresh, size: 16, color: AppTheme.textMuted),
            label: const Text(
              'RESET SESI BOT WA',
              style: TextStyle(fontSize: 11, letterSpacing: 0.8),
            ),
          ),
        ),
      ],
    );
  }
}
