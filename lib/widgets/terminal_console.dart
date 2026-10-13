import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/terminal_log.dart';
import '../services/websocket_service.dart';
import '../theme/app_theme.dart';

class TerminalConsole extends StatefulWidget {
  final List<TerminalLog> logs;
  final WsConnectionStatus wsStatus;
  final VoidCallback onClear;
  final VoidCallback onReconnect;

  const TerminalConsole({
    Key? key,
    required this.logs,
    required this.wsStatus,
    required this.onClear,
    required this.onReconnect,
  }) : super(key: key);

  @override
  State<TerminalConsole> createState() => _TerminalConsoleState();
}

class _TerminalConsoleState extends State<TerminalConsole> {
  final ScrollController _scrollController = ScrollController();
  bool _autoScroll = true;

  @override
  void didUpdateWidget(covariant TerminalConsole oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (_autoScroll && widget.logs.length != oldWidget.logs.length) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOut,
          );
        }
      });
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Color get _wsIndicatorColor {
    switch (widget.wsStatus) {
      case WsConnectionStatus.connected:
        return AppTheme.neonGreen;
      case WsConnectionStatus.connecting:
        return AppTheme.neonYellow;
      case WsConnectionStatus.disconnected:
        return AppTheme.neonRed;
    }
  }

  String get _wsStatusText {
    switch (widget.wsStatus) {
      case WsConnectionStatus.connected:
        return 'LIVE WS';
      case WsConnectionStatus.connecting:
        return 'CONNECTING';
      case WsConnectionStatus.disconnected:
        return 'OFFLINE';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppTheme.terminalBoxDecoration(),
      child: Column(
        children: [
          // Terminal Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: Color(0xFF0F141D),
              borderRadius: BorderRadius.vertical(top: Radius.circular(7)),
              border: Border(
                bottom: BorderSide(color: Color(0xFF1E2838), width: 1),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.terminal, color: AppTheme.neonCyan, size: 16),
                    const SizedBox(width: 8),
                    const Text(
                      'REALTIME TERMINAL CONSOLE',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const SizedBox(width: 8),
                    // WS Status Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: _wsIndicatorColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: _wsIndicatorColor.withOpacity(0.4)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _wsIndicatorColor,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _wsStatusText,
                            style: TextStyle(
                              color: _wsIndicatorColor,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    // Auto-scroll toggle
                    InkWell(
                      onTap: () {
                        setState(() {
                          _autoScroll = !_autoScroll;
                        });
                      },
                      child: Row(
                        children: [
                          Icon(
                            _autoScroll ? Icons.lock : Icons.lock_open,
                            size: 13,
                            color: _autoScroll ? AppTheme.neonCyan : AppTheme.textMuted,
                          ),
                          const SizedBox(width: 3),
                          Text(
                            'AUTOSCROLL',
                            style: TextStyle(
                              fontSize: 9,
                              color: _autoScroll ? AppTheme.neonCyan : AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Clear Logs Button
                    InkWell(
                      onTap: widget.onClear,
                      child: const Row(
                        children: [
                          Icon(Icons.clear_all, size: 14, color: AppTheme.textMuted),
                          SizedBox(width: 2),
                          Text(
                            'CLEAR',
                            style: TextStyle(fontSize: 9, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                    if (widget.wsStatus == WsConnectionStatus.disconnected) ...[
                      const SizedBox(width: 10),
                      InkWell(
                        onTap: widget.onReconnect,
                        child: const Row(
                          children: [
                            Icon(Icons.sync, size: 14, color: AppTheme.neonYellow),
                            SizedBox(width: 2),
                            Text(
                              'RECONNECT',
                              style: TextStyle(fontSize: 9, color: AppTheme.neonYellow),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // Log Content List
          Expanded(
            child: widget.logs.isEmpty
                ? const Center(
                    child: Text(
                      'root@ndika-bot:~\$ Menunggu log aktivitas WhatsApp...',
                      style: TextStyle(color: Color(0xFF3E4F66), fontSize: 12),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    itemCount: widget.logs.length,
                    itemBuilder: (context, index) {
                      final item = widget.logs[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2.5),
                        child: SelectableText.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: '[${item.formattedTime}] ',
                                style: const TextStyle(
                                  color: Color(0xFF5A6F8A),
                                  fontSize: 11,
                                ),
                              ),
                              TextSpan(
                                text: '${item.tag} ',
                                style: TextStyle(
                                  color: item.color,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                              TextSpan(
                                text: item.message,
                                style: const TextStyle(
                                  color: Color(0xFFD6E2EE),
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
