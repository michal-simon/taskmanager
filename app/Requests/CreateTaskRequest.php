<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest {

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
            'source_type' => 'nullable|numeric',
            'rating' => 'nullable|numeric',
            'customer_id' => 'nullable|numeric',
            'task_type' => 'required',
            'title' => 'required',
            'content' => 'required',
            'contributors' => 'required|numeric',
            'created_by' => 'required|string',
            'due_date' => 'required',
            'task_status' => 'required',
            'project_id' => 'nullable',
            'task_color' => 'nullable|string',
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
            'content.required' => 'Content is required!',
            //'contributors.required' => 'Contributors is required!',
            'due_date.required' => 'Due date is required!',
        ];
    }

}
