<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id', 'foto_jalan', 'judul_laporan', 'deskripsi', 
        'lokasi_detail', 'latitude', 'longitude', 'status'
    ];

    // Relasi ke User (Pembuat Laporan)
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Relasi ke tabel Upvotes
    public function upvotes()
    {
        return $this->hasMany(Upvote::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }
}
