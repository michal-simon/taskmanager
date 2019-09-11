<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username'          => 'required|string',
            'profile_photo'     => 'nullable|string',
            'email'             => 'required|string',
            'first_name'        => 'required|string',
            'last_name'         => 'required|string'
        ];
    }

    /**
     * Custom message for validation
     *
     * @return array
     */
    public function messages()
    {
        return [
            'username.required'     => 'Username is required!',
            'email.required'        => 'Email is required!',
            'first_name.required'   => 'First Name is required!',
            'last_name.required'    => 'Last Name is required!'
        ];
    }
}
