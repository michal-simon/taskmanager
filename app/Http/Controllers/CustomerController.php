<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Customer;
use App\Repositories\CustomerRepository;
use App\Repositories\AddressRepository;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\AddressRepositoryInterface;
use App\Transformations\CustomerTransformable;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Requests\CreateCustomerRequest;

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
    public function __construct(CustomerRepositoryInterface $customerRepository, AddressRepositoryInterface $addressRepository) {
        $this->customerRepo = $customerRepository;
        $this->addressRepo = $addressRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {

        $orderBy = !$request->column ? 'first_name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        $list = $this->customerRepo->listCustomers($orderBy, $orderDir);

        if (request()->has('q')) {
            $list = $this->customerRepo->searchCustomer(request()->input('q'));
        }

        $customers = $list->map(function (Customer $customer) {
                    return $this->transformCustomer($customer);
                })->all();

        $paginatedResults = $this->customerRepo->paginateArrayResults($customers, $recordsPerPage);

        return $paginatedResults->toJson();
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
        $customer = $this->customerRepo->findCustomerById($id);
        $address = $customer->addresses;

        $update = new CustomerRepository($customer);
        $data = $request->except('_method', '_token');
        $update->updateCustomer($data);

        if (!empty($address)) {
            $addRessRepo = new AddressRepository($address[0]);

            $addRessRepo->updateAddress([
                'phone' => $request->phone,
                'address_1' => $request->address_1,
                'address_2' => $request->address_2,
                'zip' => $request->zip,
                'city' => $request->city,
            ]);
        }

        $list = $this->customerRepo->listCustomers('created_at', 'desc');

        if (request()->has('q')) {
            $list = $this->customerRepo->searchCustomer(request()->input('q'));
        }

        $customers = $list->map(function (Customer $customer) {
                    return $this->transformCustomer($customer);
                })->all();

        return collect($customers)->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCustomerRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerRequest $request) {

        $customer = $this->customerRepo->createCustomer($request->except('_token', '_method'));

        $customer->addresses()->create([
            'phone' => $request->phone,
            'address_1' => $request->address_1,
            'address_2' => $request->address_2,
            'zip' => $request->zip,
            'city' => $request->city,
            'country_id' => 225,
            'status' => 1
        ]);

        return $customer->toJson();
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

        $customer = $this->customerRepo->findCustomerById($id);
        $address = $customer->addresses;

        if (!empty($address)) {
            $addRessRepo = new AddressRepository($address[0]);
            $addRessRepo->deleteAddress();
        }

        $customerRepo = new CustomerRepository($customer);
        $customerRepo->deleteCustomer();

        return response()->json('Customer deleted!');
    }

}
