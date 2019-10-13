<?php
namespace App\Requests;
use App\Repositories\Base\BaseFormRequest;
use Illuminate\Validation\Rule;
class UpdateTaskStatusRequest extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', Rule::unique('order_statuses')->ignore($this->segment('4'))]
        ];
    }
}
