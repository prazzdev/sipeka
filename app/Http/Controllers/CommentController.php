<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request, Report $report)
    {
        $request->validate(['pesan' => 'required|string']);

        Comment::create([
            'report_id' => $report->id,
            'user_id' => auth()->id(),
            'pesan' => $request->pesan,
        ]);

        return redirect()->back()->with('message', 'Tanggapan berhasil dikirim.');
    }
}
