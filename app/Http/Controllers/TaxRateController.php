<?php

namespace App\Http\Controllers;

use App\Repositories\TaxRateRepository;
use App\Repositories\Interfaces\TaxRateRepositoryInterface;
use App\Requests\CreateTaxRateRequest;
use App\Requests\SearchRequest;
use App\Shop\Couriers\Requests\UpdateTaxRateRequest;
use App\Http\Controllers\Controller;

class TaxRateController extends Controller {

    /**
     * @var TaxRateRepositoryInterface
     */
    private $taxRateRepo;

    /**
     * TaxRateController constructor.
     * @param TaxRateRepositoryInterface $taxRateRepository
     */
    public function __construct(TaxRateRepositoryInterface $taxRateRepository) {
        $this->taxRateRepo = $taxRateRepository;
    }

    public function index(SearchRequest $request) {
        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;
        
        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->taxRateRepo->searchTaxRate(request()->input('search_term'));
        } else {
            $list = $this->taxRateRepo->listTaxRates(['*'], $orderBy, $orderDir);
        }

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->taxRateRepo->paginateArrayResults($list, $recordsPerPage);
            return $paginatedResults->toJson();
        }
        
        return response()->json($list);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCourierRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCourierRequest $request) {
        $taxRate = $this->taxRateRepo->createTaxRate($request->all());
        return $response()->json($taxRate);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCourierRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaxRateRequest $request, $id) {
        $taxRate = $this->taxRateRepo->findTaxRateById($id);
        $update = new TaxRateRepository($taxRate);
        $update->updateTaxRate($request->all());
        return response()->json($taxRate);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id) {
        $taxRate = $this->taxRateRepo->findTaxRateById($id);
        $taxRateRepo = new TaxRateRepository($taxRate);
        $taxRateRepo->delete();
        return response()->json('deleted');
    }

}
