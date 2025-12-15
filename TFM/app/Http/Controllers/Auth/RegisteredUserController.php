<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuaris,email'],
            'contrasenya' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    
        $user = \App\Models\User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'contrasenya' => Hash::make($request->contrasenya),
            'data_registre' => now(),
            'rol' => 'usuari',
        ]);
    
        return response()->json([
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => $user
        ], 201);
    }
}
