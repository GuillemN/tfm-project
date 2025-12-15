<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserItemStatus;

use App\Http\Requests\ToggleUserItemStatusRequest;

class UserItemStatusController extends Controller
{

    public function toggle(ToggleUserItemStatusRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        try {
            if ($validated['action'] === 'add') {
                UserItemStatus::firstOrCreate([
                    'user_id' => $user->id_usuari,
                    'item_id' => $validated['item_id'],
                    'item_type' => $validated['item_type'],
                    'status' => $validated['status'],
                ]);
            } else {
                UserItemStatus::where([
                    'user_id' => $user->id_usuari,
                    'item_id' => $validated['item_id'],
                    'item_type' => $validated['item_type'],
                    'status' => $validated['status'],
                ])->delete();
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'DB error',
                'details' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['success' => true]);
    }


    public function list(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $items = UserItemStatus::where('user_id', $user->id_usuari)->get();
        return response()->json($items);
    }


    public function getRefugisByStatus(Request $request, string $status)
    {
        return $this->getItemsByStatus($request, $status, 'refugi', 'refugis', 'id_refugi');
    }


    public function getPicsByStatus(Request $request, string $status)
    {
        return $this->getItemsByStatus($request, $status, 'pic', 'pics', 'id_pic');
    }


    public function getEstanysByStatus(Request $request, string $status)
    {
        return $this->getItemsByStatus($request, $status, 'estany', 'estanys', 'id_estany');
    }


    public function getRutesByStatus(Request $request, string $status)
    {
        return $this->getItemsByStatus($request, $status, 'ruta', 'rutes', 'id');
    }


    private function getItemsByStatus(Request $request, string $status, string $type, string $table, string $key)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $items = DB::table('user_item_status')
            ->join($table, 'user_item_status.item_id', '=', "{$table}.{$key}")
            ->where('user_item_status.user_id', $user->id_usuari)
            ->where('user_item_status.item_type', $type)
            ->where('user_item_status.status', $status)
            ->select("{$table}.*")
            ->get();

        return response()->json($items);
    }
}
