<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ruta;
use App\Models\PuntRuta;
use Illuminate\Support\Facades\DB;




class RutaController extends Controller
{
    // GET /api/rutes
    public function index()
    {
        return response()->json(Ruta::all());
    }

    // GET /api/rutes/{id}
    public function getById($id)
    {
        return response()->json(Ruta::findOrFail($id));
    }
    // GET /api/rutes/{id}/mapa
    public function show($id)
    {
        $ruta = Ruta::select('id', 'nom', 'json')->findOrFail($id);
        return response()->json($ruta);
    }

    public function getPuntsRuta($id)
    {
        $punts = PuntRuta::with('detall')->where('ruta_id', $id)->get();
        return response()->json($punts);
    }


    public function punts($id)
    {
        return response()->json(PuntRuta::where('ruta_id', $id)->get());
    }
}