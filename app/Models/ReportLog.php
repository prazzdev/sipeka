<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportLog extends Model
{
    protected $fillable = ['report_id', 'status', 'catatan'];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}