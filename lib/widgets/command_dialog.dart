import 'package:flutter/material.dart';
import '../models/sender_command.dart';
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
  final _searchController = TextEditingController();

  List<SenderCommand> _commands = List.of(SenderCommand.defaultCatalog);
  SenderCommand _selectedCommand = SenderCommand.defaultCatalog.first;
  String _activeCategoryFilter = 'all'; // 'all', 'combo', 'single', 'utility'

  int _count = 1;
  int _delayMs = 1000;

  bool _isLoading = false;
  String? _statusMessage;
  bool _isSuccess = false;

  @override
  void initState() {
    super.initState();
    _fetchDynamicCommands();
  }

  Future<void> _fetchDynamicCommands() async {
    final fetched = await widget.apiService.getAvailableCommands();
    if (fetched.isNotEmpty && mounted) {
      setState(() {
        _commands = fetched.map((e) => SenderCommand.fromJson(e as Map<String, dynamic>)).toList();
        // Pastikan selected command tetap valid
        _selectedCommand = _commands.firstWhere(
          (c) => c.id == _selectedCommand.id,
          orElse: () => _commands.first,
        );
      });
    }
  }

  @override
  void dispose() {
    _targetController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  List<SenderCommand> get _filteredCommands {
    final query = _searchController.text.trim().toLowerCase();
    return _commands.where((c) {
      final matchesCategory = _activeCategoryFilter == 'all' || c.category == _activeCategoryFilter;
      final matchesQuery = query.isEmpty ||
          c.name.toLowerCase().contains(query) ||
          c.id.toLowerCase().contains(query) ||
          c.description.toLowerCase().contains(query) ||
          c.aliases.any((a) => a.toLowerCase().contains(query));
      return matchesCategory && matchesQuery;
    }).toList();
  }

  void _showCommandPickerModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        side: BorderSide(color: AppTheme.neonCyan, width: 1.2),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalContext, setModalState) {
            final query = _searchController.text.trim().toLowerCase();
            final filtered = _commands.where((c) {
              final matchesCategory = _activeCategoryFilter == 'all' || c.category == _activeCategoryFilter;
              final matchesQuery = query.isEmpty ||
                  c.name.toLowerCase().contains(query) ||
                  c.id.toLowerCase().contains(query) ||
                  c.description.toLowerCase().contains(query) ||
                  c.aliases.any((a) => a.toLowerCase().contains(query));
              return matchesCategory && matchesQuery;
            }).toList();

            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.flash_on, color: AppTheme.neonCyan, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'PILIH FUNGSI SENDER (${_commands.length})',
                            style: const TextStyle(
                              color: AppTheme.neonCyan,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: AppTheme.textMuted, size: 20),
                        onPressed: () => Navigator.of(ctx).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Search Bar
                  TextField(
                    controller: _searchController,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Cari nama, ID, atau aksi...',
                      prefixIcon: const Icon(Icons.search, color: AppTheme.neonCyan, size: 18),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: AppTheme.textMuted, size: 16),
                              onPressed: () {
                                _searchController.clear();
                                setModalState(() {});
                                setState(() {});
                              },
                            )
                          : null,
                      contentPadding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    ),
                    onChanged: (val) {
                      setModalState(() {});
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: 10),

                  // Category Filter Tabs
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildCategoryChip('Semua (${_commands.length})', 'all', setModalState),
                        const SizedBox(width: 6),
                        _buildCategoryChip('🚀 Combo (${_commands.where((c) => c.category == 'combo').length})', 'combo', setModalState),
                        const SizedBox(width: 6),
                        _buildCategoryChip('⚡ Sender Bug (${_commands.where((c) => c.category == 'single').length})', 'single', setModalState),
                        const SizedBox(width: 6),
                        _buildCategoryChip('🛠️ Utility (${_commands.where((c) => c.category == 'utility').length})', 'utility', setModalState),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  // List of commands
                  Expanded(
                    child: filtered.isEmpty
                        ? const Center(
                            child: Text(
                              'Tidak ada perintah yang sesuai pencarian.',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                            ),
                          )
                        : ListView.separated(
                            itemCount: filtered.length,
                            separatorBuilder: (c, i) => const Divider(color: Color(0xFF1E2838), height: 1),
                            itemBuilder: (c, i) {
                              final cmd = filtered[i];
                              final isSelected = cmd.id == _selectedCommand.id;
                              return ListTile(
                                dense: true,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                leading: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: _getCategoryColor(cmd.category).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: _getCategoryColor(cmd.category), width: 0.8),
                                  ),
                                  child: Text(
                                    cmd.category.toUpperCase(),
                                    style: TextStyle(
                                      color: _getCategoryColor(cmd.category),
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                title: Text(
                                  cmd.name,
                                  style: TextStyle(
                                    color: isSelected ? AppTheme.neonCyan : Colors.white,
                                    fontSize: 13,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  ),
                                ),
                                subtitle: Text(
                                  '${cmd.id} • ${cmd.description}',
                                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: isSelected
                                    ? const Icon(Icons.check_circle, color: AppTheme.neonCyan, size: 18)
                                    : null,
                                onTap: () {
                                  setState(() {
                                    _selectedCommand = cmd;
                                  });
                                  Navigator.of(ctx).pop();
                                },
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildCategoryChip(String label, String categoryKey, void Function(void Function()) setModalState) {
    final isSelected = _activeCategoryFilter == categoryKey;
    return GestureDetector(
      onTap: () {
        setModalState(() {
          _activeCategoryFilter = categoryKey;
        });
        setState(() {
          _activeCategoryFilter = categoryKey;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.neonCyan.withOpacity(0.2) : AppTheme.surfaceDark,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color: isSelected ? AppTheme.neonCyan : const Color(0xFF2E3A4E),
            width: isSelected ? 1.2 : 0.8,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppTheme.neonCyan : AppTheme.textMuted,
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Color _getCategoryColor(String cat) {
    switch (cat) {
      case 'combo':
        return AppTheme.neonPink;
      case 'single':
        return AppTheme.neonYellow;
      case 'utility':
        return AppTheme.neonGreen;
      default:
        return AppTheme.neonCyan;
    }
  }

  Future<void> _confirmAndSendCommand() async {
    final target = _targetController.text.trim();

    if (target.isEmpty || target.length < 5) {
      setState(() {
        _statusMessage = 'Target tidak valid (masukkan nomor WhatsApp atau link/ID grup).';
        _isSuccess = false;
      });
      return;
    }

    // Dialog Konfirmasi Eksekusi
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
              'KONFIRMASI EKSEKUSI',
              style: TextStyle(color: AppTheme.neonYellow, fontSize: 13, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Eksekusi: ${_selectedCommand.name} (${_selectedCommand.id})',
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text('• Target : $target', style: const TextStyle(color: AppTheme.textLight, fontSize: 12)),
            Text('• Jumlah : $_count kali', style: const TextStyle(color: AppTheme.textLight, fontSize: 12)),
            Text('• Jeda   : ${_delayMs}ms', style: const TextStyle(color: AppTheme.textLight, fontSize: 12)),
            const SizedBox(height: 8),
            const Text(
              'Pastikan target adalah nomor yang diizinkan untuk keperluan pengujian sistem.',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 11, fontStyle: FontStyle.italic),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('BATAL', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.neonYellow,
              foregroundColor: Colors.black,
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('EKSEKUSI SEKARANG'),
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
      command: _selectedCommand.id,
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
        constraints: const BoxConstraints(maxWidth: 460),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.send_rounded, color: AppTheme.neonCyan, size: 22),
                      SizedBox(width: 8),
                      Text(
                        'PENGIRIM PERINTAH SENDER',
                        style: TextStyle(
                          color: AppTheme.neonCyan,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.neonCyan.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '${_commands.length} FUNC',
                      style: const TextStyle(color: AppTheme.neonCyan, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Pasang dan jalankan seluruh fungsi sender dari message handler Baileys.',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
              ),
              const SizedBox(height: 16),

              // Target Input
              const Text(
                'TARGET WHATSAPP (NOMOR / LINK / ID GRUP)',
                style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _targetController,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(
                  hintText: '6281234567890 atau https://chat.whatsapp.com/xxx',
                  prefixIcon: Icon(Icons.person_pin, color: AppTheme.neonCyan, size: 18),
                ),
              ),
              const SizedBox(height: 14),

              // Command Selector
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'FUNGSI SENDER TERPILIH',
                    style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  GestureDetector(
                    onTap: _showCommandPickerModal,
                    child: const Text(
                      'Ubah / Cari ➔',
                      style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              InkWell(
                onTap: _showCommandPickerModal,
                borderRadius: BorderRadius.circular(6),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF131A26),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFF2E3A4E)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: _getCategoryColor(_selectedCommand.category).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: _getCategoryColor(_selectedCommand.category), width: 0.8),
                        ),
                        child: Text(
                          _selectedCommand.category.toUpperCase(),
                          style: TextStyle(
                            color: _getCategoryColor(_selectedCommand.category),
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _selectedCommand.name,
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'ID: ${_selectedCommand.id} • ${_selectedCommand.description}',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_drop_down, color: AppTheme.neonCyan),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Parameter: Jumlah & Jeda
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'JUMLAH EKSEKUSI',
                          style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<int>(
                          value: _count,
                          dropdownColor: AppTheme.surfaceDark,
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(
                            contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                          ),
                          items: const [
                            DropdownMenuItem(value: 1, child: Text('1x Eksekusi')),
                            DropdownMenuItem(value: 2, child: Text('2x Eksekusi')),
                            DropdownMenuItem(value: 5, child: Text('5x Eksekusi')),
                            DropdownMenuItem(value: 10, child: Text('10x Eksekusi')),
                            DropdownMenuItem(value: 20, child: Text('20x Eksekusi')),
                            DropdownMenuItem(value: 50, child: Text('50x Eksekusi')),
                          ],
                          onChanged: (val) {
                            if (val != null) setState(() => _count = val);
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'JEDA ANTAR (MS)',
                          style: TextStyle(color: AppTheme.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<int>(
                          value: _delayMs,
                          dropdownColor: AppTheme.surfaceDark,
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(
                            contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                          ),
                          items: const [
                            DropdownMenuItem(value: 100, child: Text('100 ms (Cepat)')),
                            DropdownMenuItem(value: 500, child: Text('500 ms')),
                            DropdownMenuItem(value: 1000, child: Text('1000 ms (1s)')),
                            DropdownMenuItem(value: 1500, child: Text('1500 ms (1.5s)')),
                            DropdownMenuItem(value: 2000, child: Text('2000 ms (2s)')),
                            DropdownMenuItem(value: 3000, child: Text('3000 ms (3s)')),
                          ],
                          onChanged: (val) {
                            if (val != null) setState(() => _delayMs = val);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Status message
              if (_statusMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _isSuccess
                        ? AppTheme.neonGreen.withOpacity(0.12)
                        : AppTheme.neonPink.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: _isSuccess ? AppTheme.neonGreen : AppTheme.neonPink,
                      width: 0.8,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _isSuccess ? Icons.check_circle_outline : Icons.error_outline,
                        color: _isSuccess ? AppTheme.neonGreen : AppTheme.neonPink,
                        size: 16,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _statusMessage!,
                          style: TextStyle(
                            color: _isSuccess ? AppTheme.neonGreen : AppTheme.neonPink,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
              ],

              // Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: _isLoading ? null : () => Navigator.of(context).pop(),
                    child: const Text('TUTUP', style: TextStyle(color: AppTheme.textMuted)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.neonCyan,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onPressed: _isLoading ? null : _confirmAndSendCommand,
                    icon: _isLoading
                        ? const SizedBox(
                            width: 14,
                            height: 14,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                          )
                        : const Icon(Icons.flash_on, size: 16),
                    label: Text(
                      _isLoading ? 'MEMPROSES...' : 'KIRIM PERINTAH',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
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
