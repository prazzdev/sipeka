<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Upvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpvoteController extends Controller
{
    public function toggle(Report $report)
    {
        $userId = Auth::id();
        
        // Cek apakah user sudah pernah vote laporan ini
        $existingUpvote = Upvote::where('user_id', $userId)
                                ->where('report_id', $report->id)
                                ->first();

        if ($existingUpvote) {
            // Jika sudah ada, hapus (Unvote)
            $existingUpvote::where('user_id', $userId)
                           ->where('report_id', $report->id)
                           ->delete();
            $report->decrement('total_upvote');
            $message = 'Upvote dibatalkan';
        } else {
            // Jika belum ada, tambah (Upvote)
            Upvote::create([
                'user_id' => $userId,
                'report_id' => $report->id
            ]);
            $report->increment('total_upvote');
            $message = 'Berhasil memberikan Upvote';
        }

        return redirect()->back();
    }
}