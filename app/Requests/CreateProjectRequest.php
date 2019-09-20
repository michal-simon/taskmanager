<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest {

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
            'created_by' => 'string|required',
            'customer_id' => 'numeric|nullable',
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
            'created_by.required' => 'Created by is required!'
        ];
    }

}