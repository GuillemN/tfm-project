<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuaris';
    protected $primaryKey = 'id_usuari';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'contrasenya',
        'data_registre',
        'rol'
    ];

    public function getAuthPassword()
    {
        return $this->contrasenya;
    }
    public function getAuthIdentifierName()
    {
        return 'id_usuari';
    }
}
