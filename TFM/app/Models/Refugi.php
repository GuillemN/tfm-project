<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refugi extends Model
{
    protected $table = 'refugis'; 
    protected $primaryKey = 'id_refugi'; 
    public $timestamps = false; 

    protected $fillable = [
        'nom',
        'coordenades',
        'capacitat',
        'contacte',
        'imatge',
        'parroquies'
    ];

    public function rutes()
    {
        return $this->belongsToMany(Ruta::class, 'punts_ruta', 'tipus_id', 'ruta_id')
                    ->wherePivot('tipus', 'Refugis');
    }
}

