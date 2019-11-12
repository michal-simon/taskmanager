<?php

namespace App\Http\Controllers;

use App\Repositories\PaymentRepository;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use App\Requests\CreatePaymentRequest;
use App\Requests\UpdatePaymentRequest;
use App\Http\Controllers\Controller;
use App\Requests\SearchRequest;

class PaymentController extends Controller {

    /**
     * @var PaymentRepositoryInterface
     */
    private $paymentRepo;

    /**
     * PaymentController constructor.
     * @param PaymentRepositoryInterface $paymentRepository
     */
    public function __construct(PaymentRepositoryInterface $paymentRepository) {
        $this->paymentRepo = $paymentRepository;
    }

    public function index(SearchRequest $request) {
        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;
        
        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->paymentRepo->searchPayment(request()->input('search_term'));
        } else {
            $list = $this->paymentRepo->listPayments(['*'], $orderBy, $orderDir);
        }

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->paymentRepo->paginateArrayResults($list, $recordsPerPage);
            return $paginatedResults->toJson();
        }
        
        return response()->json($list);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreatePaymentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePaymentRequest $request) {
        $taxRate = $this->paymentRepo->createPayment($request->all());
        return $response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCourierRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePaymentRequest $request, $id) {
        $payment = $this->paymentRepo->findPaymentById($id);
        $update = new PaymentRepository($payment);
        $update->updatePayment($request->all());
        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id) {
        $payment = $this->paymentRepo->findPaymentById($id);
        $paymentRepo = new PaymentRepository($payment);
        $paymentRepo->delete();
        return response()->json('deleted');
    }

}
