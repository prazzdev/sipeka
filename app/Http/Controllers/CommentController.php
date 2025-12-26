<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Report;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request, Report $report)
    {
        $request->validate([
            'pesan' => 'required|string',
            'foto_tanggapan' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_tanggapan')) {
            $fotoPath = $request->file('foto_tanggapan')->store('tanggapan-admin', 'public');
        }

        Comment::create([
            'report_id' => $report->id,
            'user_id' => auth()->id(),
            'pesan' => $request->pesan,
            'foto_tanggapan' => $fotoPath,
        ]);

        return redirect()->back()->with('message', 'Tanggapan resmi telah dikirim.');
    }

    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'pesan' => 'required|string|min:5',
            'foto_tanggapan' => 'nullable|image|max:2048'
        ]);

        // Jika ada foto baru yang diunggah
        if ($request->hasFile('foto_tanggapan')) {
            // Hapus foto lama agar storage tidak penuh
            if ($comment->foto_tanggapan) {
                Storage::disk('public')->delete($comment->foto_tanggapan);
            }
            // Simpan foto baru
            $path = $request->file('foto_tanggapan')->store('tanggapan-admin', 'public');
            $comment->foto_tanggapan = $path;
        }

        $comment->pesan = $request->pesan;
        $comment->save();

        return back()->with('message', 'Tanggapan berhasil diperbarui.');
    }

    public function destroy(Comment $comment)
    {
        // 1. Keamanan
        if (auth()->id() !== $comment->user_id && auth()->user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki akses untuk menghapus ini.');
        }

        // 2. Ambil Report melalui relasi (Gunakan ini sebelum comment didelete)
        $report = $comment->report;

        // Tambahan: Pastikan report ditemukan untuk menghindari error "on null"
        if (!$report) {
            return redirect()->back()->with('error', 'Data laporan terkait tidak ditemukan.');
        }

        // 3. Hapus file gambar jika ada
        if ($comment->foto_tanggapan) {
            Storage::disk('public')->delete($comment->foto_tanggapan);
        }

        // 4. Hapus Komentar
        $comment->delete();

        // 5. Sinkronisasi Status
        // Kita panggil relasi comments dari objek $report yang sudah kita ambil di atas
        $lastComment = $report->comments()->latest()->first();

        if ($lastComment) {
            $report->update([
                'status' => $lastComment->status
            ]);
        } else {
            $report->update([
                'status' => 'menunggu'
            ]);
        }

        return redirect()->back()->with('message', 'Tanggapan dihapus dan status laporan disesuaikan.');
    }
}
