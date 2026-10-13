import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';

enum LogLevel { info, warn, error, success }

class TerminalLog {
  final String type;
  final DateTime timestamp;
  final LogLevel level;
  final String message;
  final dynamic data;

  TerminalLog({
    required this.type,
    required this.timestamp,
    required this.level,
    required this.message,
    this.data,
  });

  factory TerminalLog.fromJson(Map<String, dynamic> json) {
    final rawLevel = (json['level'] as String? ?? 'info').toLowerCase();
    LogLevel lvl = LogLevel.info;
    if (rawLevel == 'error') {
      lvl = LogLevel.error;
    } else if (rawLevel == 'warn' || rawLevel == 'warning') {
      lvl = LogLevel.warn;
    } else if (rawLevel == 'success') {
      lvl = LogLevel.success;
    }

    DateTime parsedTime;
    try {
      parsedTime = json['timestamp'] != null
          ? DateTime.parse(json['timestamp'] as String)
          : DateTime.now();
    } catch (_) {
      parsedTime = DateTime.now();
    }

    return TerminalLog(
      type: json['type'] as String? ?? 'log',
      timestamp: parsedTime,
      level: lvl,
      message: json['message'] as String? ?? '',
      data: json['data'],
    );
  }

  factory TerminalLog.local(LogLevel level, String message) {
    return TerminalLog(
      type: 'local',
      timestamp: DateTime.now(),
      level: level,
      message: message,
    );
  }

  String get formattedTime {
    return DateFormat('HH:mm:ss').format(timestamp);
  }

  Color get color {
    switch (level) {
      case LogLevel.info:
        return AppTheme.neonCyan;
      case LogLevel.warn:
        return AppTheme.neonYellow;
      case LogLevel.error:
        return AppTheme.neonRed;
      case LogLevel.success:
        return AppTheme.neonGreen;
    }
  }

  String get tag {
    switch (level) {
      case LogLevel.info:
        return '[INFO]';
      case LogLevel.warn:
        return '[WARN]';
      case LogLevel.error:
        return '[ERR]';
      case LogLevel.success:
        return '[OK]';
    }
  }
}
