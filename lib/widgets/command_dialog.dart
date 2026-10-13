import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class CommandDialog extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onCommandSent;

  const CommandDialog({
    Key? key,
    required this.apiService,
    required this.onCommandSent,
  }) : super(key: key);

  @override
  State<CommandDialog> createState() => _CommandDialogState();
}

class _CommandDialogState extends State<CommandDialog> {
  final _targetController = TextEditingController();
  String _selectedCommand = 'test-message';
  int _count = 1;
  int _delayMs = 1000;

  bool _isLoading = false;
  String? _statusMessage;
  bool _isSuccess = false;

  @override
  void dispose() {
    _targetController.dispose();
    super.dispose();
  }

  Future<void> _confirmAndSendCommand() async {
    final target = _targetController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');

    if (target.isEmpty || target.length < 8) {
      setState(() {
        _statusMessage = 'Nomor target WhatsApp tidak valid (minimal 8 digit).';
        _isSuccess = false;
      });
      return;
    }

    // Tampilkan Dialog Konfirmasi
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppTheme.neonYellow),
        ),
        title: const Row(
          children: [
            Icon(Icons.warning_amber, color: AppTheme.neonYellow, size: 20),
            SizedBox(width: 8),
            Text(
              'KONFIRMASI PENGUJIAN',
              style: TextStyle(color: AppTheme.neonYellow, fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Text(
          'Apakah Anda yakin ingin mengirim $_count pesan pengujian ke nomor +$target dengan jeda ${_delayMs}ms?',
          style: const TextStyle(color: AppTheme.textLight, fontSize: 12),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.neonYellow, foregroundColor: Colors.black),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('KIRIM SEKARANG'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() {
      _isLoading = true;
      _statusMessage = null;
    });

    final res = await widget.apiService.sendCommand(
      target: target,
      command: _selectedCommand,
      count: _count,
      delayMs: _delayMs,
    );

    setState(() {
      _isLoading = false;
      _isSuccess = res.success;
      _statusMessage = res.message;
    });

    if (res.success) {
      widget.onCommandSent();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppTheme.surfaceDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: const BorderSide(color: AppTheme.neonCyan, width: 1.2),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 440),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Row(
                children: [
                  Icon(Icons.send_rounded, color: AppTheme.neonCyan, size: 22),
                  SizedBox(width: 8),
                  Text(
                    'PENGUJIAN PERINTAH BOT',
                    style: TextStyle(
                      color: AppTheme.neonCyan,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Kirim sinyal uji coba verifikasi ke nomor tujuan yang berwenang.',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
              ),
              const SizedBox(height: 16),

              // Target Input
              const Text(
                'TARGET WHATSAPP (NOMOR TUJUAN)',
                style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _targetController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: const InputDecoration(
                  hintText: '6281234567890',
                  prefixIcon: Icon(Icons.person_pin, color: AppTheme.neonCyan, size: 18),
                ),
              ),
              const SizedBox(height: 14),

              // Command Selector
              const Text(
                'JENIS PERINTAH',
                style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceDark,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFF2E3A4E)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedCommand,
                    isExpanded: true,
                    dropdownColor: AppTheme.surfaceDark,
                    style: const TextStyle(color: Colors.white, fontFamily: 'monospace'),
                    items: const [
                      DropdownMenuItem(
                        value: 'test-message',
                        child: Text('test-message (Kirim Pesan Uji Standar)'),
                      ),
                      DropdownMenuItem(
                        value: 'ping',
                        child: Text('ping (Pemeriksaan Responsivitas)'),
                      ),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCommand = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Count Slider (1 to 5)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'JUMLAH PESAN (MAX 5)',
                    style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '$_count pesan',
                    style: const TextStyle(color: AppTheme.neonGreen, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Slider(
                value: _count.toDouble(),
                min: 1,
                max: 5,
                divisions: 4,
                activeColor: AppTheme.neonCyan,
                inactiveColor: const Color(0xFF2E3A4E),
                onChanged: (val) {
                  setState(() => _count = val.round());
                },
              ),
              const SizedBox(height: 8),

              // Delay Slider (1000ms to 5000ms)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'JEDA ANTARPESAN (DELAY)',
                    style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${_delayMs} ms',
                    style: const TextStyle(color: AppTheme.neonYellow, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Slider(
                value: _delayMs.toDouble(),
                min: 1000,
                max: 5000,
                divisions: 8,
                activeColor: AppTheme.neonYellow,
                inactiveColor: const Color(0xFF2E3A4E),
                onChanged: (val) {
                  setState(() => _delayMs = val.round());
                },
              ),
              const SizedBox(height: 12),

              // Status Banner
              if (_statusMessage != null)
                Container(
                  padding: const EdgeInsets.all(10),
                  margin: const EdgeInsets.only(bottom: 14),
                  decoration: BoxDecoration(
                    color: (_isSuccess ? AppTheme.neonGreen : AppTheme.neonRed).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: (_isSuccess ? AppTheme.neonGreen : AppTheme.neonRed).withOpacity(0.4)),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _isSuccess ? Icons.check_circle_outline : Icons.error_outline,
                        color: _isSuccess ? AppTheme.neonGreen : AppTheme.neonRed,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _statusMessage!,
                          style: TextStyle(
                            color: _isSuccess ? AppTheme.neonGreen : AppTheme.neonRed,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: _isLoading ? null : () => Navigator.of(context).pop(),
                    child: const Text('TUTUP', style: TextStyle(color: AppTheme.textMuted)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _confirmAndSendCommand,
                    child: _isLoading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                          )
                        : const Text('EKSEKUSI PERINTAH'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
