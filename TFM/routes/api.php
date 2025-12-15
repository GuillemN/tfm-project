<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\TokenAuthController;
use App\Http\Controllers\Api\RefugiController;
use App\Http\Controllers\Api\UserItemStatusController;
use App\Http\Controllers\Api\RutaController;
use App\Http\Controllers\Api\PicController;
use App\Http\Controllers\Api\EstanyController;
use App\Http\Controllers\Api\MeteoController;
use App\Http\Controllers\Api\ViaFerradaController;

// Rutes públiques
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [TokenAuthController::class, 'login']);
Route::get('/refugis', [RefugiController::class, 'index']);
Route::get('/refugis/{id}', [RefugiController::class, 'getById']);
Route::get('/meteo', [MeteoController::class, 'getForecast']);
Route::get('/rutes', [RutaController::class, 'index']);
Route::get('/rutes/{id}', [RutaController::class, 'getById']);
Route::get('/rutes/{id}/mapa', [RutaController::class, 'show']);
Route::get('/rutes/{id}/punts', [RutaController::class, 'getPuntsRuta']);
Route::get('/refugis/{id}/rutes', [RefugiController::class, 'getRutesPerRefugi']);
Route::get('/pics', [PicController::class, 'index']);
Route::get('/pics/{id}', [PicController::class, 'getById']);
Route::get('/pics/{id}/rutes', [PicController::class, 'getRutesPerPic']);
Route::get('/estanys', [EstanyController::class, 'index']);
Route::get('/estanys/{id}', [EstanyController::class, 'getById']);
Route::get('/estanys/{id}/rutes', [EstanyController::class, 'getRutesPerEstany']);
Route::get('/vies-ferrades', [ViaFerradaController::class, 'index']);
Route::get('/vies-ferrades/{id}', [ViaFerradaController::class, 'getById']);

// Rutes protegides per autenticació amb Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

// Estats dels ítems
Route::post('/user-item-status/toggle', [UserItemStatusController::class, 'toggle']);
Route::get('/user-item-status', [UserItemStatusController::class, 'list']);

// Rutes d’ítems per tipus i estat
Route::get('/user/refugis/{status}', [UserItemStatusController::class, 'getRefugisByStatus']);
Route::get('/user/pics/{status}', [UserItemStatusController::class, 'getPicsByStatus']);
Route::get('/user/estanys/{status}', [UserItemStatusController::class, 'getEstanysByStatus']);
Route::get('/user/rutes/{status}', [UserItemStatusController::class, 'getRutesByStatus']);



});
