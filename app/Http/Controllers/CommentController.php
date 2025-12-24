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

    public function destroy(Comment $comment)
    {
        // Pastikan hanya admin/pemilik komentar yang bisa menghapus
        if (auth()->id() !== $comment->user_id && auth()->user()->role !== 'admin') {
            abort(403);
        }

        // Hapus file gambar dari storage jika ada
        if ($comment->foto_tanggapan) {
            Storage::disk('public')->delete($comment->foto_tanggapan);
        }

        $comment->delete();

        return redirect()->back()->with('message', 'Tanggapan telah dihapus.');
    }
}
