<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PuntRuta extends Model
{
    protected $table = 'punts_ruta';
    public $timestamps = false;

    protected $fillable = [
        'ruta_id',
        'tipus',
        'tipus_id',
        'ordre'
    ];

    public function detall()
    {
        return $this->morphTo(__FUNCTION__, 'tipus', 'tipus_id');
    }
}
