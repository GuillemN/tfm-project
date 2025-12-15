<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MeteoController extends Controller
{
    public function getForecast(Request $request)
{
    $lat = $request->query('lat');
    $lon = $request->query('lon');

    if (!$lat || !$lon) {
        return response()->json(['error' => 'Missing lat or lon'], 400);
    }

    $apiKey = env('OPENWEATHERMAP_API_KEY');
    $url = "https://api.openweathermap.org/data/2.5/forecast?lat={$lat}&lon={$lon}&units=metric&lang=ca&appid={$apiKey}";

    try {
        $response = Http::get($url);

        if ($response->failed()) {
            return response()->json(['error' => 'External API failed', 'details' => $response->body()], 502);
        }

        $originalData = $response->json();
        $list = $originalData['list'] ?? [];

        $previsio = array_map(function ($item) {
            return [
                'data' => $item['dt_txt'],
                'temperatura' => round($item['main']['temp'], 2),
                'pluja' => isset($item['rain']['3h']) ? $item['rain']['3h'] : 0,
                'vent' => round($item['wind']['speed'] * 3.6, 1), // m/s -> km/h
                'icon' => $item['weather'][0]['icon'],
                'descripcio' => $item['weather'][0]['description']
            ];
        }, $list);

        return response()->json(['previsio' => $previsio]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Exception',
            'message' => $e->getMessage()
        ], 500);
    }
}
}
