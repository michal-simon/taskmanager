<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest {

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
            'title' => 'string|required',
            'description' => 'string|required',
            'customer_id' => 'numeric|required',
        ];
    }

    /**
     * Custom message for validation
     *
     * @return array
     */
    public function messages() {
        return [
            'title.required' => 'Title is required!',
            'description.required' => 'Description is required!',
            'customer_id.required' => 'Customer is required!'
        ];
    }

}
