<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pic extends Model
{
    protected $table = 'pics';
    protected $primaryKey = 'id_pic';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'altitud',
        'descripcio',
        'coordenades',
        'imatge'
    ];
}
