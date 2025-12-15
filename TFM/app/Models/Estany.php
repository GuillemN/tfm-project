<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estany extends Model
{
    protected $table = 'estanys';
    protected $primaryKey = 'id_estany';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'altitud',
        'coordenades',
        'imatge',
        'superficie',
        'artificial'
    ];
}
