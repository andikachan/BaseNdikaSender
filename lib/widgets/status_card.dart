import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/bot_status.dart';
import '../theme/app_theme.dart';

class StatusCard extends StatelessWidget {
  final BotStatus status;
  final bool isRefreshing;
  final VoidCallback onRefresh;

  const StatusCard({
    Key? key,
    required this.status,
    required this.isRefreshing,
    required this.onRefresh,
  }) : super(key: key);

  Color get _statusColor {
    if (status.online) return AppTheme.neonGreen;
    if (status.connectionState == 'connecting' || status.isResetting) return AppTheme.neonYellow;
    return AppTheme.neonRed;
  }

  String get _statusLabel {
    if (status.isResetting) return 'RESETTING';
    if (status.online) return 'ONLINE';
    if (status.connectionState == 'connecting') return 'CONNECTING';
    if (status.connectionState == 'open') return 'CONNECTED';
    return 'OFFLINE';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppTheme.cyberpunkCardDecoration(
        borderColor: _statusColor.withOpacity(0.5),
        borderWidth: 1.2,
        glow: status.online,
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _statusColor,
                      boxShadow: [
                        BoxShadow(
                          color: _statusColor.withOpacity(0.8),
                          blurRadius: 6,
                          spreadRadius: 2,
                        )
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _statusLabel,
                    style: TextStyle(
                      color: _statusColor,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (status.authenticated)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.neonCyan.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppTheme.neonCyan.withOpacity(0.4)),
                      ),
                      child: const Text(
                        'AUTHENTICATED',
                        style: TextStyle(
                          color: AppTheme.neonCyan,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              IconButton(
                icon: isRefreshing
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppTheme.neonCyan,
                        ),
                      )
                    : const Icon(Icons.refresh, color: AppTheme.neonCyan, size: 20),
                onPressed: isRefreshing ? null : onRefresh,
                tooltip: 'Refresh Status',
                constraints: const BoxConstraints(),
                padding: EdgeInsets.zero,
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Bot Identity Row
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceDark,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppTheme.neonCyan.withOpacity(0.3)),
                ),
                child: const Icon(
                  Icons.smart_toy_outlined,
                  color: AppTheme.neonCyan,
                  size: 28,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      status.botName ?? 'Ndika WhatsApp Bot',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    if (status.phoneNumber != null)
                      GestureDetector(
                        onTap: () {
                          Clipboard.setData(ClipboardData(text: status.phoneNumber!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Nomor bot disalin ke clipboard!'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
                        child: Row(
                          children: [
                            const Icon(Icons.phone_iphone, size: 14, color: AppTheme.textMuted),
                            const SizedBox(width: 4),
                            Text(
                              '+${status.phoneNumber}',
                              style: const TextStyle(
                                color: AppTheme.neonCyan,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(Icons.copy, size: 12, color: AppTheme.textMuted),
                          ],
                        ),
                      )
                    else
                      const Text(
                        'Belum ada akun WhatsApp terhubung',
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          const Divider(color: Color(0xFF253043), height: 1),
          const SizedBox(height: 12),

          // Grid Metrics (Uptime, Latency, Session, Commands)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricItem(
                label: 'UPTIME',
                value: status.formattedUptime,
                icon: Icons.timer_outlined,
                color: AppTheme.textLight,
              ),
              _buildMetricItem(
                label: 'LATENCY',
                value: '${status.latencyMs} ms',
                icon: Icons.speed,
                color: status.latencyMs < 150
                    ? AppTheme.neonGreen
                    : (status.latencyMs < 400 ? AppTheme.neonYellow : AppTheme.neonRed),
              ),
              _buildMetricItem(
                label: 'SESSION',
                value: status.sessionExists ? 'SAVED' : 'EMPTY',
                icon: Icons.folder_open,
                color: status.sessionExists ? AppTheme.neonGreen : AppTheme.textMuted,
              ),
              _buildMetricItem(
                label: 'ACTIVE TASKS',
                value: '${status.activeCommandsCount}',
                icon: Icons.sync,
                color: status.activeCommandsCount > 0 ? AppTheme.neonCyan : AppTheme.textMuted,
              ),
            ],
          ),

          if (status.lastDisconnectReason != null && !status.online) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.neonRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: AppTheme.neonRed.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, size: 14, color: AppTheme.neonRed),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      status.lastDisconnectReason!,
                      style: const TextStyle(color: AppTheme.neonRed, fontSize: 11),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ]
        ],
      ),
    );
  }

  Widget _buildMetricItem({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 12, color: AppTheme.textMuted),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(
                color: AppTheme.textMuted,
                fontSize: 10,
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
