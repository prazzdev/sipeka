<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'foto_jalan', 'judul_laporan', 'deskripsi', 
        'lokasi_detail', 'latitude', 'longitude', 'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($report) {
            // JIKA nomor_laporan sudah diisi (misalnya oleh Factory/Seeder), jangan timpa lagi.
            if (empty($report->nomor_laporan)) {
                
                // Ambil tanggal dari created_at jika ada (berguna untuk Seeder), 
                // jika tidak ada (input manual warga) gunakan tanggal hari ini.
                $dateSource = $report->created_at ?: now();
                $datePrefix = $dateSource->format('ymd'); 

                // Hitung laporan pada hari yang sama dengan dateSource
                $todayCount = self::whereDate('created_at', $dateSource->format('Y-m-d'))->count();
                
                $sequence = str_pad($todayCount + 1, 2, '0', STR_PAD_LEFT);

                $report->nomor_laporan = $datePrefix . $sequence;
            }
        });
    }

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
