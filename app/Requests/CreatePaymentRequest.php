<?php
namespace App\Requests;
use App\Repositories\Base\BaseFormRequest;
class CreatePaymentRequest extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'customer_id' => ['required', 'unique:couriers'],
            'total' => ['required'],
            'tax_total' => ['required'],
            'discount_total' => ['required']
        ];
    }
}
