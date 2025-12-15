<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleUserItemStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_id' => 'required|integer',
            'item_type' => 'required|string',
            'status' => 'required|string|in:wishlist,done',
            'action' => 'required|string|in:add,remove'
        ];
    }
}
