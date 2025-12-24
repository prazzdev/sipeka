<!DOCTYPE html>
<html>
<head>
    <title>Laporan SIPEKA</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #1e3a8a; color: white; }
        .header { text-align: center; margin-bottom: 20px; }
        .badge { padding: 2px 5px; border-radius: 4px; font-size: 10px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="header">
        <h2>DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</h2>
        <h3>Sistem Informasi Pelaporan Kerusakan Jalan (SIPEKA)</h3>
        <p>Kecamatan Madukara, Banjarnegara</p>
        <hr>
    </div>

    <p><strong>Filter Status:</strong> {{ ucfirst($status) }}</p>
    <p><strong>Tanggal Cetak:</strong> {{ $date }}</p>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Judul Laporan</th>
                <th>Pelapor</th>
                <th>Lokasi Detail</th>
                <th>Status</th>
                <th>Upvotes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports as $index => $report)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $report->judul_laporan }}</td>
                <td>{{ $report->user->name }}</td>
                <td>{{ $report->lokasi_detail }}</td>
                <td>{{ strtoupper($report->status) }}</td>
                <td>{{ $report->total_upvote }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>