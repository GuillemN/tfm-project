<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class PicController extends Controller
{
    // GET /api/pics
    public function index()
    {
        return response()->json(Pic::all());
    }

    // GET /api/pics/{id}
    public function getById($id)
    {
        $pic = Pic::findOrFail($id);
        return response()->json($pic);
    }
    public function getRutesPerPic($id)
{
    $rutes = DB::table('punts_ruta')
        ->join('rutes', 'punts_ruta.ruta_id', '=', 'rutes.id')
        ->where('punts_ruta.tipus', 'Pics')
        ->where('punts_ruta.tipus_id', $id)
        ->select('rutes.id', 'rutes.nom', 'rutes.imatge', 'rutes.dificultat', 'rutes.distancia_km', 'rutes.desnivell')
        ->distinct()
        ->get();

    return response()->json($rutes);
}
}
