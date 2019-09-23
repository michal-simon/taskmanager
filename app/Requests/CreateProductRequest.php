<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest {
    
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
            'sku' => 'required|string',
            'name' => ['required', 'unique:products'],
            'description' => 'required:string',
            'price' => 'required',
        ];
    }

}
