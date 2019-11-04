<?php

namespace App\Requests;

use App\Repositories\Base\BaseFormRequest;

class CreateUserRequest extends BaseFormRequest {

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
            'password' => [
                'required',
                'string',
                'min:10',             // must be at least 10 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ],
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
