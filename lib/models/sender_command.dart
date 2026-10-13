class SenderCommand {
  final String id;
  final String name;
  final String category; // 'combo', 'single', 'utility'
  final String description;
  final List<String> aliases;

  const SenderCommand({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    this.aliases = const [],
  });

  factory SenderCommand.fromJson(Map<String, dynamic> json) {
    return SenderCommand(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? 'single',
      description: json['description'] as String? ?? '',
      aliases: (json['aliases'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
    );
  }

  /// Koleksi Lengkap 39 Fungsi & Perintah Sender Default (Handler Engine)
  static const List<SenderCommand> defaultCatalog = [
    // --- 1. COMBO & ACTION FLOWS ---
    SenderCommand(
      id: 'blank',
      name: 'Blank Delay Combo',
      category: 'combo',
      description: 'Button Flood + Delay Blank + Button Bug',
      aliases: ['ghost', 'blankxdelay'],
    ),
    SenderCommand(
      id: 'combo',
      name: 'Classic Attack Combo',
      category: 'combo',
      description: 'Button Flood + Button Bug + Interactive + Group Status',
      aliases: ['xcamb'],
    ),
    SenderCommand(
      id: 'combov2',
      name: 'Combo V2 Ultra',
      category: 'combo',
      description: 'Delay Blank + Button Flood + Interactive Flood',
      aliases: ['xcamb2'],
    ),
    SenderCommand(
      id: 'freeze',
      name: 'Freeze / Forclose Bug',
      category: 'combo',
      description: 'Kirim payload Forclose Bug berulang kali',
      aliases: ['forclose', 'close', 'forclos', 'fcnew'],
    ),
    SenderCommand(
      id: 'blast',
      name: 'Blast D-Five Sender',
      category: 'combo',
      description: 'Kombinasi Button Bug + Button Flood',
      aliases: ['sender', 'dfive', 'd-five'],
    ),
    SenderCommand(
      id: 'overdrive',
      name: 'Overdrive Gear 4',
      category: 'combo',
      description: 'Group Status + Gear 4 Payload + Interactive Flood',
      aliases: ['gear4', 'boost'],
    ),
    SenderCommand(
      id: 'click',
      name: 'Crash Click / Tap',
      category: 'combo',
      description: 'Kombinasi Crash Click Bug + Button Bug',
      aliases: ['tap', 'crashclik'],
    ),
    SenderCommand(
      id: 'delay',
      name: 'Full Delay Hard Push',
      category: 'combo',
      description: 'Full Delay Bug + Group Status + Button Flood + Button Bug',
      aliases: ['push', 'fulldelay'],
    ),
    SenderCommand(
      id: 'pushmedia',
      name: 'Push Media Spam Video',
      category: 'combo',
      description: 'Kirim payload buffer video bersiklus',
      aliases: ['spampic', 'spambkp', 'spambokep'],
    ),
    SenderCommand(
      id: 'grouptest',
      name: 'Group Crash & Blast',
      category: 'combo',
      description: 'Kirim group crash payload ke ID grup target',
      aliases: ['joincheck', 'xban', 'xband', 'groupblast', 'bangb'],
    ),

    // --- 2. 27 FUNGSI SENDER TUNGGAL HANDLER ---
    SenderCommand(
      id: 'sendAddressCrash',
      name: 'Address Crash',
      category: 'single',
      description: 'Interactive Address ViewOnce Crash',
      aliases: ['address-crash'],
    ),
    SenderCommand(
      id: 'sendForcloseBug',
      name: 'Forclose Bug',
      category: 'single',
      description: 'Payload Forclose Extended Text & Interactive',
      aliases: ['forclose-bug'],
    ),
    SenderCommand(
      id: 'sendLocationCrash',
      name: 'Location Crash',
      category: 'single',
      description: 'Payload Live Location Crash Buffer',
      aliases: ['location-crash'],
    ),
    SenderCommand(
      id: 'sendButtonBug',
      name: 'Button Bug',
      category: 'single',
      description: 'Payload Interactive Button Overflow',
      aliases: ['button-bug'],
    ),
    SenderCommand(
      id: 'sendGroupStatusBug',
      name: 'Group Status Bug',
      category: 'single',
      description: 'Payload Relay Group Status Message',
      aliases: ['group-status-bug'],
    ),
    SenderCommand(
      id: 'sendLegacyCrash',
      name: 'Legacy Crash',
      category: 'single',
      description: 'Payload Legacy Interactive Header Overflow',
      aliases: ['legacy-crash'],
    ),
    SenderCommand(
      id: 'sendGalaxyCrash',
      name: 'Galaxy Crash',
      category: 'single',
      description: 'Payload Galaxy List Carousel Message',
      aliases: ['galaxy-crash'],
    ),
    SenderCommand(
      id: 'sendDelayHardBug',
      name: 'Delay Hard Bug',
      category: 'single',
      description: 'Payload Delay Hard Interactive Header',
      aliases: ['delay-hard-bug'],
    ),
    SenderCommand(
      id: 'sendStatusMentionCrash',
      name: 'Status Mention Crash',
      category: 'single',
      description: 'Payload Status Mention Group Invitation',
      aliases: ['status-mention-crash'],
    ),
    SenderCommand(
      id: 'sendStatusMentionProtocol',
      name: 'Status Protocol Bug',
      category: 'single',
      description: 'Payload Protocol Mention Status',
      aliases: ['status-mention-protocol'],
    ),
    SenderCommand(
      id: 'sendCallPermissionBug',
      name: 'Call Permission Bug',
      category: 'single',
      description: 'Payload Call Permission Request',
      aliases: ['call-permission-bug'],
    ),
    SenderCommand(
      id: 'sendInvoicePaymentBug',
      name: 'Invoice Payment Bug',
      category: 'single',
      description: 'Payload Invoice Payment Request Payment',
      aliases: ['invoice-payment-bug'],
    ),
    SenderCommand(
      id: 'sendProtocolRepeatBug',
      name: 'Protocol Repeat Bug',
      category: 'single',
      description: 'Payload Protocol Repeat Sequence',
      aliases: ['protocol-repeat-bug'],
    ),
    SenderCommand(
      id: 'sendCrashClickBug',
      name: 'Crash Click Bug',
      category: 'single',
      description: 'Payload Interactive Button Tap Overflow',
      aliases: ['crash-click-bug'],
    ),
    SenderCommand(
      id: 'sendGroupCrash',
      name: 'Group Crash',
      category: 'single',
      description: 'Payload Group Invite / Crash Message',
      aliases: ['group-crash'],
    ),
    SenderCommand(
      id: 'sendLocationCrash2',
      name: 'Location Crash V2',
      category: 'single',
      description: 'Payload Location Degree Extreme Overflow',
      aliases: ['location-crash-2'],
    ),
    SenderCommand(
      id: 'sendViewOnceBug',
      name: 'View Once Bug',
      category: 'single',
      description: 'Payload View Once Video & Image Interactive',
      aliases: ['view-once-bug'],
    ),
    SenderCommand(
      id: 'sendDelayBlankBug',
      name: 'Delay Blank Bug',
      category: 'single',
      description: 'Payload Blank Delay Message Buffer',
      aliases: ['delay-blank-bug'],
    ),
    SenderCommand(
      id: 'sendPaymentInviteBug',
      name: 'Payment Invite Bug',
      category: 'single',
      description: 'Payload Payment Invite Service Notification',
      aliases: ['payment-invite-bug'],
    ),
    SenderCommand(
      id: 'sendInteractiveFloodBug',
      name: 'Interactive Flood Bug',
      category: 'single',
      description: 'Payload Interactive Message Flood Cards',
      aliases: ['interactive-flood-bug'],
    ),
    SenderCommand(
      id: 'sendStatusBug',
      name: 'Status Bug',
      category: 'single',
      description: 'Payload Status Mention Notification',
      aliases: ['status-bug'],
    ),
    SenderCommand(
      id: 'sendFullDelayBug',
      name: 'Full Delay Bug',
      category: 'single',
      description: 'Payload Full Delay Interactive',
      aliases: ['full-delay-bug'],
    ),
    SenderCommand(
      id: 'sendButtonFloodBug',
      name: 'Button Flood Bug',
      category: 'single',
      description: 'Payload Flood Buttons Array',
      aliases: ['button-flood-bug'],
    ),
    SenderCommand(
      id: 'sendGear4Bug',
      name: 'Gear 4 Bug',
      category: 'single',
      description: 'Payload Gear 4 Interactive Flow Attack',
      aliases: ['gear4-bug'],
    ),
    SenderCommand(
      id: 'sendQuickReplyBug',
      name: 'Quick Reply Bug',
      category: 'single',
      description: 'Payload Quick Reply Interactive',
      aliases: ['quick-reply-bug'],
    ),
    SenderCommand(
      id: 'sendSpamBkpVideo',
      name: 'Spam Video Bug',
      category: 'single',
      description: 'Payload Spam Video Buffer Message',
      aliases: ['spam-video-bug'],
    ),
    SenderCommand(
      id: 'sendGroupStatusMention',
      name: 'Group Status Mention',
      category: 'single',
      description: 'Payload Request Payment Mention Relay',
      aliases: ['group-status-mention'],
    ),

    // --- 3. UTILITY & TEST ---
    SenderCommand(
      id: 'test-message',
      name: 'Standard Test Message',
      category: 'utility',
      description: 'Kirim pesan verifikasi teks biasa ke target',
      aliases: ['test', 'msg'],
    ),
    SenderCommand(
      id: 'ping',
      name: 'Ping Latency Check',
      category: 'utility',
      description: 'Kirim ping teks responsivitas ke target',
      aliases: ['p'],
    ),
  ];
}
