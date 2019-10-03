<?php

namespace App\Requests;

use App\Repositories\Base\BaseFormRequest;

class CreateCustomerRequest extends BaseFormRequest {

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'address_1' => ['required'],
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email', 'unique:customers'],
        ];
    }

}
