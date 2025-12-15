<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{
    protected $table = 'rutes';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'descripcio',
        'dificultat',
        'desnivell',
        'distancia_km',
        'temps_estimacio',
        'imatge',
        'coordenades',
        'json'
    ];

    protected $casts = [
        'json' => 'array', 
    ];
}
