<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Register berhasil',
            'data' => $user
        ]);
    }

    public function login(Request $request)
    {
        if (!$token = Auth::attempt($request->only('email','password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Login gagal'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
    }
}
