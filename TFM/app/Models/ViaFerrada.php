<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViaFerrada extends Model
{
    protected $table = 'vies_ferrades'; 
    protected $primaryKey = 'id_via_ferrada'; 
    public $timestamps = false; 

    protected $fillable = [
        'nom',
        'dificultat',
        'desnivell',
        'temps_tornada',
        'temps_anada',
        'temps_via',
        'coordenades',
        'imatge',
        'Parroquia',
        'estat',
        'Descripcio'
    ];
}
