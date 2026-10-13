import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'services/api_service.dart';
import 'services/websocket_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final apiService = ApiService();
  await apiService.init();

  final wsService = WebSocketService();

  runApp(BotManagerApp(
    apiService: apiService,
    wsService: wsService,
  ));
}

class BotManagerApp extends StatelessWidget {
  final ApiService apiService;
  final WebSocketService wsService;

  const BotManagerApp({
    Key? key,
    required this.apiService,
    required this.wsService,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ndika Bot Manager',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.cyberpunkTheme,
      home: DashboardScreen(
        apiService: apiService,
        wsService: wsService,
      ),
    );
  }
}
