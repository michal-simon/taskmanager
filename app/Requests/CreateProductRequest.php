<?php

namespace App\Requests;

use App\Repositories\Base\BaseFormRequest;

class CreateProductRequest extends BaseFormRequest {

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
