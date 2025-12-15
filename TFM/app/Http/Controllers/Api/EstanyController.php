<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class EstanyController extends Controller
{
    // GET /api/estanys
    public function index()
    {
        return response()->json(Estany::all());
    }

    // GET /api/estanys/{id}
    public function getById($id)
    {
        $estany = Estany::findOrFail($id);
        return response()->json($estany);
    }
    public function getRutesPerEstany($id)
{
    $rutes = DB::table('punts_ruta')
        ->join('rutes', 'punts_ruta.ruta_id', '=', 'rutes.id')
        ->where('punts_ruta.tipus', 'Estanys')
        ->where('punts_ruta.tipus_id', $id)
        ->select('rutes.id', 'rutes.nom', 'rutes.imatge', 'rutes.dificultat', 'rutes.distancia_km', 'rutes.desnivell')
        ->distinct()
        ->get();

    return response()->json($rutes);
}
}
