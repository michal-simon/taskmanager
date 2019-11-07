<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\AddressRepositoryInterface;
use App\Transformations\CustomerTransformable;
use App\Requests\UpdateCustomerRequest;
use App\Requests\CreateCustomerRequest;
use App\Requests\SearchRequest;
use App\Repositories\CustomerTypeRepository;
use App\CustomerType;
use Illuminate\Http\Request;
use App\Services\Interfaces\CustomerServiceInterface;

class CustomerController extends Controller {

    use CustomerTransformable;

    /**
     * @var CustomerRepositoryInterface
     */
    private $customerRepo;

    /**
     * @var AddressRepositoryInterface
     */
    private $addressRepo;

    /**
     * CustomerController constructor.
     * @param CustomerRepositoryInterface $customerRepository
     * @param AddressRepositoryInterface $addressRepository
     */
    public function __construct(CustomerRepositoryInterface $customerRepository, AddressRepositoryInterface $addressRepository, CustomerServiceInterface $customerService) {
        $this->customerRepo = $customerRepository;
        $this->addressRepo = $addressRepository;
        $this->customerService = $customerService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(SearchRequest $request) {

        $customers = $this->customerService->search($request);

        $customers->getCollection()->transform(function($customer) {
           return $this->transformCustomer($customer);
        })->all();
        
        return response()->json($customers);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id) {
        $customer = $this->customerRepo->findCustomerById($id);
        return collect($customer, $customer->addresses)->toJson();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCustomerRequest $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerRequest $request, $id) {
        $customer = $this->customerService->update($request, $id);
        return response()->json($this->transformCustomer($customer));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCustomerRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerRequest $request) {
        $customer = $this->customerService->create($request);
        return $this->transformCustomer($customer);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id) {
        $response = $this->customerService->delete($id);

        if ($response) {
            return response()->json('Customer deleted!');
        }

        return response()->json('Unable to delete customer!');
    }

    public function getCustomerTypes() {
        $customerTypes = (new CustomerTypeRepository(new CustomerType))->getAll();
        return response()->json($customerTypes);
    }

    /**
     * 
     * @param \App\Http\Controllers\Request $request
     * @return type
     */
    public function filterCustomers(Request $request) {
        $list = $this->customerRepo->filterCustomers($request->all());
        $customers = $list->map(function (Customer $customer) {
                    return $this->transformCustomer($customer);
                })->all();
        return response()->json($customers);
    }

}
