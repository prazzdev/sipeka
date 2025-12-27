<!DOCTYPE html>
<html>
<head>
    <title>Laporan SIPEKA</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; word-wrap: break-word; }
        th { background-color: #1e3a8a; color: white; text-transform: uppercase; font-size: 10px; }
        .header { text-align: center; margin-bottom: 10px; }
        .header h2, .header h3 { margin: 2px 0; }
        hr { border: 1px solid #1e3a8a; margin-bottom: 15px; }
        .filter-info { margin-bottom: 20px; line-height: 1.6; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 9px; color: #777; }
        
        /* Pewarnaan Status */
        .status-text { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</h2>
        <h3>Sistem Informasi Pelaporan Kerusakan Jalan (SIPEKA)</h3>
        <p>Kecamatan Madukara, Banjarnegara</p>
        <hr>
    </div>

    <div class="filter-info">
        <table style="border: none; margin-top: 0;">
            <tr style="border: none;">
                <td style="border: none; padding: 0; width: 50%;">
                    <strong>Filter Status:</strong> {{ $status ? ucfirst($status) : 'Semua Status' }}<br>
                    <strong>Periode:</strong> 
                    @if($month && $month !== 'all')
                        {{ DateTime::createFromFormat('!m', $month)->format('F') }}
                    @else
                        Semua Bulan
                    @endif
                    {{ $year ?? 'Semua Tahun' }}
                </td>
                <td style="border: none; padding: 0; width: 50%; text-align: right; vertical-align: top;">
                    <strong>Tanggal Cetak:</strong> {{ $date }}<br>
                    <strong>Total Laporan:</strong> {{ $reports->count() }}
                </td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5px;">No</th>
                <th style="width: 70px;">No. Laporan</th>
                <th>Judul Laporan</th>
                <th style="width: 80px;">Pelapor</th>
                <th>Lokasi Detail</th>
                <th style="width: 70px;">Status</th>
                <th style="width: 40px; text-align: center;">Upvotes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $index => $report)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $report->nomor_laporan }}</td>
                <td><strong>{{ $report->judul_laporan }}</strong></td>
                <td>{{ $report->user->name }}</td>
                <td>{{ $report->lokasi_detail }}</td>
                <td class="status-text">{{ strtoupper($report->status) }}</td>
                <td style="text-align: center;">{{ $report->total_upvote }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px;">Tidak ada data laporan yang ditemukan untuk filter ini.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dicetak otomatis oleh Sistem SIPEKA pada {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>