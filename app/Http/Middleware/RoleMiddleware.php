<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Jika user belum login atau role-nya tidak ada dalam daftar yang diizinkan
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            // Redirect ke beranda atau kirim pesan error
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        return $next($request);
    }
}