<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest {

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
            'customer_id' => 'required',
            'beginDate' => 'required',
            'endDate' => 'required',
            'location' => 'string|required',
            'title' => 'string|required',
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
            'customer_id.required' => 'Customer is required!',
            'location.required' => 'Location is required!',
            'beginDate.required' => 'Start date is required!',
            'endDate.required' => 'End date is required!',
        ];
    }

}
