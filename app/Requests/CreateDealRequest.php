<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDealRequest extends FormRequest {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'title' => ['required'],
            'valued_at' => ['required'],
            'address_1' => ['required'],
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email', 'unique:customers'],
        ];
    }

}