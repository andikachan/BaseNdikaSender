class BotStatus {
  final bool online;
  final String connectionState;
  final String? phoneNumber;
  final String? botName;
  final bool authenticated;
  final bool sessionExists;
  final int uptimeSeconds;
  final String serverTime;
  final String? lastDisconnectReason;
  final bool isResetting;
  final int activeCommandsCount;
  final int latencyMs;

  BotStatus({
    required this.online,
    required this.connectionState,
    this.phoneNumber,
    this.botName,
    required this.authenticated,
    required this.sessionExists,
    required this.uptimeSeconds,
    required this.serverTime,
    this.lastDisconnectReason,
    required this.isResetting,
    required this.activeCommandsCount,
    this.latencyMs = 0,
  });

  factory BotStatus.initial() {
    return BotStatus(
      online: false,
      connectionState: 'unknown',
      phoneNumber: null,
      botName: null,
      authenticated: false,
      sessionExists: false,
      uptimeSeconds: 0,
      serverTime: DateTime.now().toIso8601String(),
      lastDisconnectReason: null,
      isResetting: false,
      activeCommandsCount: 0,
      latencyMs: 0,
    );
  }

  factory BotStatus.fromJson(Map<String, dynamic> json, {int latencyMs = 0}) {
    return BotStatus(
      online: json['online'] as bool? ?? false,
      connectionState: json['connectionState'] as String? ?? 'disconnected',
      phoneNumber: json['phoneNumber'] as String?,
      botName: json['botName'] as String?,
      authenticated: json['authenticated'] as bool? ?? false,
      sessionExists: json['sessionExists'] as bool? ?? false,
      uptimeSeconds: (json['uptimeSeconds'] as num?)?.toInt() ?? 0,
      serverTime: json['serverTime'] as String? ?? DateTime.now().toIso8601String(),
      lastDisconnectReason: json['lastDisconnectReason'] as String?,
      isResetting: json['isResetting'] as bool? ?? false,
      activeCommandsCount: (json['activeCommandsCount'] as num?)?.toInt() ?? 0,
      latencyMs: latencyMs,
    );
  }

  String get formattedUptime {
    final d = uptimeSeconds ~/ (24 * 3600);
    final h = (uptimeSeconds % (24 * 3600)) ~/ 3600;
    final m = (uptimeSeconds % 3600) ~/ 60;
    final s = uptimeSeconds % 60;

    if (d > 0) return '${d}d ${h}h ${m}m';
    if (h > 0) return '${h}h ${m}m ${s}s';
    if (m > 0) return '${m}m ${s}s';
    return '${s}s';
  }

  BotStatus copyWithLatency(int newLatency) {
    return BotStatus(
      online: online,
      connectionState: connectionState,
      phoneNumber: phoneNumber,
      botName: botName,
      authenticated: authenticated,
      sessionExists: sessionExists,
      uptimeSeconds: uptimeSeconds,
      serverTime: serverTime,
      lastDisconnectReason: lastDisconnectReason,
      isResetting: isResetting,
      activeCommandsCount: activeCommandsCount,
      latencyMs: newLatency,
    );
  }
}
