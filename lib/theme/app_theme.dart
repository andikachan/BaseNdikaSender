import 'package:flutter/material.dart';

class AppTheme {
  // Cyberpunk Dark Palette
  static const Color neonCyan = Color(0xFF00F0FF);
  static const Color deepDark = Color(0xFF0B0E14);
  static const Color surfaceDark = Color(0xFF131822);
  static const Color cardDark = Color(0xFF1B2230);
  static const Color neonGreen = Color(0xFF00FF88);
  static const Color neonRed = Color(0xFFFF0055);
  static const Color neonYellow = Color(0xFFFFD700);
  static const Color neonPurple = Color(0xFF9D00FF);
  static const Color textMuted = Color(0xFF8A99AD);
  static const Color textLight = Color(0xFFF0F4F8);

  static ThemeData get cyberpunkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: deepDark,
      primaryColor: neonCyan,
      cardColor: cardDark,
      colorScheme: const ColorScheme.dark(
        primary: neonCyan,
        secondary: neonGreen,
        surface: surfaceDark,
        error: neonRed,
        onPrimary: Colors.black,
        onSecondary: Colors.black,
        onSurface: textLight,
      ),
      fontFamily: 'monospace',
      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: neonCyan,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
          fontFamily: 'monospace',
        ),
        iconTheme: IconThemeData(color: neonCyan),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: neonCyan,
          foregroundColor: Colors.black,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(6),
            side: const BorderSide(color: neonCyan, width: 1.2),
          ),
          textStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
            fontFamily: 'monospace',
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceDark,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: const BorderSide(color: Color(0xFF2E3A4E)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: const BorderSide(color: Color(0xFF2E3A4E)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: const BorderSide(color: neonCyan, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: const BorderSide(color: neonRed, width: 1.5),
        ),
        hintStyle: const TextStyle(color: textMuted, fontSize: 13),
        labelStyle: const TextStyle(color: neonCyan, fontSize: 14),
      ),
    );
  }

  // Cyberpunk Box Decoration Helpers
  static BoxDecoration cyberpunkCardDecoration({
    Color borderColor = const Color(0xFF253043),
    double borderWidth = 1.0,
    bool glow = false,
  }) {
    return BoxDecoration(
      color: cardDark,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: glow
          ? [
              BoxShadow(
                color: borderColor.withOpacity(0.3),
                blurRadius: 10,
                spreadRadius: 1,
              )
            ]
          : [],
    );
  }

  static BoxDecoration terminalBoxDecoration() {
    return BoxDecoration(
      color: const Color(0xFF07090D),
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: const Color(0xFF1E2838), width: 1.2),
    );
  }
}
