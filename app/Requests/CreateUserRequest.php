<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest {

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
            'department' => 'nullable|numeric',
            'gender' => 'nullable|string',
            'job_description' => 'nullable|string',
            'phone_number' => 'nullable|string',
            'dob' => 'nullable|string',
            'role' => 'nullable|array',
            'password' => 'required|string',
            'username' => 'required|string',
            'profile_photo' => 'nullable|string',
            'email' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string'
        ];
    }

    /**
     * Custom message for validation
     *
     * @return array
     */
    public function messages() {
        return [
            'password.required' => 'Password is required!',
            'username.required' => 'Username is required!',
            'email.required' => 'Email is required!',
            'first_name.required' => 'First Name is required!',
            'last_name.required' => 'Last Name is required!'
        ];
    }

}
