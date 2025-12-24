<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
