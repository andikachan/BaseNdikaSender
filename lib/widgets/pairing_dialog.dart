import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class PairingDialog extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onSuccess;

  const PairingDialog({
    Key? key,
    required this.apiService,
    required this.onSuccess,
  }) : super(key: key);

  @override
  State<PairingDialog> createState() => _PairingDialogState();
}

class _PairingDialogState extends State<PairingDialog> {
  final _phoneController = TextEditingController();
  final _customCodeController = TextEditingController(text: 'NDIKA123');

  bool _isLoading = false;
  String? _pairingCode;
  String? _errorMessage;

  @override
  void dispose() {
    _phoneController.dispose();
    _customCodeController.dispose();
    super.dispose();
  }

  Future<void> _submitPairingRequest() async {
    final rawNumber = _phoneController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');

    if (rawNumber.isEmpty) {
      setState(() {
        _errorMessage = 'Nomor telepon tidak boleh kosong.';
      });
      return;
    }

    if (rawNumber.length < 8 || rawNumber.length > 15) {
      setState(() {
        _errorMessage = 'Format nomor tidak valid. Masukkan 8-15 digit (contoh: 6281234567890).';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _pairingCode = null;
    });

    final response = await widget.apiService.requestPairingCode(
      phoneNumber: rawNumber,
      customCode: _customCodeController.text.trim().isEmpty ? 'NDIKA123' : _customCodeController.text.trim(),
    );

    setState(() {
      _isLoading = false;
    });

    if (response.success && response.data != null) {
      final code = response.data!['pairingCode']?.toString();
      setState(() {
        _pairingCode = code;
      });
      widget.onSuccess();
    } else {
      setState(() {
        _errorMessage = response.message.isNotEmpty
            ? response.message
            : (response.error?.code ?? 'Permintaan pairing gagal');
      });
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
        constraints: const BoxConstraints(maxWidth: 420),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              Row(
                children: [
                  const Icon(Icons.qr_code_2, color: AppTheme.neonCyan, size: 22),
                  const SizedBox(width: 8),
                  const Text(
                    'REQUEST PAIRING CODE',
                    style: TextStyle(
                      color: AppTheme.neonCyan,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Hubungkan bot ke akun WhatsApp baru tanpa QR Code menggunakan kode pairing 8 digit.',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
              ),
              const SizedBox(height: 16),

              if (_pairingCode == null) ...[
                // Input Nomor Telepon
                const Text(
                  'NOMOR WHATSAPP BOT',
                  style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: const InputDecoration(
                    hintText: '6281234567890 (Gunakan kode negara)',
                    prefixIcon: Icon(Icons.phone, color: AppTheme.neonCyan, size: 18),
                  ),
                ),
                const SizedBox(height: 12),

                // Input Custom Code (Opsional)
                const Text(
                  'CUSTOM CODE (OPSIONAL)',
                  style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _customCodeController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: const InputDecoration(
                    hintText: 'NDIKA123',
                    prefixIcon: Icon(Icons.vpn_key, color: AppTheme.neonCyan, size: 18),
                  ),
                ),
                const SizedBox(height: 16),

                if (_errorMessage != null)
                  Container(
                    padding: const EdgeInsets.all(10),
                    margin: const EdgeInsets.only(bottom: 14),
                    decoration: BoxDecoration(
                      color: AppTheme.neonRed.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppTheme.neonRed.withOpacity(0.4)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: AppTheme.neonRed, size: 18),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(color: AppTheme.neonRed, fontSize: 11),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Action Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: _isLoading ? null : () => Navigator.of(context).pop(),
                      child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: _isLoading ? null : _submitPairingRequest,
                      child: _isLoading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                            )
                          : const Text('MINTA KODE'),
                    ),
                  ],
                ),
              ] else ...[
                // Success Result View
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.neonGreen.withOpacity(0.6)),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'KODE PAIRING ANDA:',
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 11, letterSpacing: 1.0),
                      ),
                      const SizedBox(height: 8),
                      SelectableText(
                        _pairingCode!,
                        style: const TextStyle(
                          color: AppTheme.neonGreen,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 4.0,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.copy, size: 16),
                        label: const Text('SALIN KODE'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.neonGreen,
                          foregroundColor: Colors.black,
                        ),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: _pairingCode!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Kode pairing berhasil disalin!'),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Tutorial Steps
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.deepDark,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFF1E2838)),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'CARA MENAUTKAN PERANGKAT:',
                        style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 6),
                      Text(
                        '1. Buka WhatsApp di HP Anda.\n'
                        '2. Buka Pengaturan > Perangkat Tertaut.\n'
                        '3. Ketuk "Tautkan Perangkat".\n'
                        '4. Pilih "Tautkan dengan nomor telepon saja".\n'
                        '5. Masukkan kode 8 digit di atas.',
                        style: TextStyle(color: AppTheme.textLight, fontSize: 11, height: 1.4),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.surfaceDark,
                      foregroundColor: AppTheme.neonCyan,
                      side: const BorderSide(color: AppTheme.neonCyan),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('SELESAI'),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
