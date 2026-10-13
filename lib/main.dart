import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'screens/login_screen.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/websocket_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final apiService = ApiService();
  await apiService.init();

  final isLoggedIn = await AuthService.init();
  final wsService = WebSocketService();

  runApp(BotManagerApp(
    apiService: apiService,
    wsService: wsService,
    initialLoggedIn: isLoggedIn,
  ));
}

class BotManagerApp extends StatefulWidget {
  final ApiService apiService;
  final WebSocketService wsService;
  final bool initialLoggedIn;

  const BotManagerApp({
    Key? key,
    required this.apiService,
    required this.wsService,
    required this.initialLoggedIn,
  }) : super(key: key);

  @override
  State<BotManagerApp> createState() => _BotManagerAppState();
}

class _BotManagerAppState extends State<BotManagerApp> {
  late bool _isLoggedIn;

  @override
  void initState() {
    super.initState();
    _isLoggedIn = widget.initialLoggedIn;
  }

  void _onLoginSuccess() {
    setState(() {
      _isLoggedIn = true;
    });
  }

  void _onLogout() async {
    await AuthService.logout();
    setState(() {
      _isLoggedIn = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NDIKA SENDER VIP',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.cyberpunkTheme,
      home: _isLoggedIn
          ? DashboardScreen(
              apiService: widget.apiService,
              wsService: widget.wsService,
              onLogout: _onLogout,
            )
          : LoginScreen(
              onLoginSuccess: _onLoginSuccess,
            ),
    );
  }
}
