<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['report_id', 'user_id', 'pesan', 'foto_tanggapan'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
