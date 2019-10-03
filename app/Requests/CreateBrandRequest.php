<?php

namespace App\Requests;

use App\Repositories\Base\BaseFormRequest;

class CreateBrandRequest extends BaseFormRequest {

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'name' => ['required', 'unique:brands'],
            'website' => ['required', 'string'],
            'phone_number' => ['required', 'string'],
            'email' => ['required', 'string'],
            'address_1' => ['required', 'string'],
            'city' => ['required', 'string'],
            'town' => ['required', 'string'],
            'postcode' => ['required', 'string'],
        ];
    }

}
