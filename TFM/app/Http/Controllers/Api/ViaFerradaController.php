<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ViaFerrada;
use Illuminate\Http\Request;

class ViaFerradaController extends Controller
{
    // GET /api/vies-ferrades
    public function index()
    {
        return response()->json(ViaFerrada::all());
    }

    // GET /api/vies-ferrades/{id}
    public function getById($id)
    {
        return response()->json(ViaFerrada::findOrFail($id));
    }
}
