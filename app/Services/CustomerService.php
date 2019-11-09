<?php

namespace App\Services;

use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\AddressRepositoryInterface;
use App\Requests\UpdateCustomerRequest;
use App\Requests\CreateCustomerRequest;
use App\Requests\SearchRequest;
use App\Services\Interfaces\CustomerServiceInterface;
use App\Services\EntityManager;
use App\Customer;

class CustomerService implements CustomerServiceInterface {

    /**
     * @var CustomerRepositoryInterface
     */
    private $customerRepo;

    /**
     * @var AddressRepositoryInterface
     */
    private $addressRepo;
    private $entityManager;

    /**
     * CustomerService constructor.
     * @param CustomerRepositoryInterface $customerRepository
     * @param AddressRepositoryInterface $addressRepository
     */
    public function __construct(CustomerRepositoryInterface $customerRepository, AddressRepositoryInterface $addressRepository) {
        $this->customerRepo = $customerRepository;
        $this->addressRepo = $addressRepository;
        $this->entityManager = new EntityManager();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search(SearchRequest $request) {
        $orderBy = !$request->column || $request->column === 'name' ? 'first_name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;

        if (request()->has('search_term') && !empty($request->search_term)) {
            return $this->customerRepo->searchCustomer(request()->input('search_term'));
        }

        return $this->customerRepo->listCustomers($orderBy, $orderDir);
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
        //$update = new CustomerRepository($customer);
        $repo = $this->entityManager::getRepository($customer);
        $data = $request->except('_method', '_token');
        $repo->updateCustomer($data);

        $repo->addAddressForCustomer([
            'address_1' => $request->address_1,
            'address_2' => $request->address_2,
            'zip' => $request->zip,
            'city' => $request->city,
            'country_id' => 225,
            'status' => 1
        ]);

        return $customer;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCustomerRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(CreateCustomerRequest $request) {

        $customer = $this->customerRepo->createCustomer($request->except('_token', '_method'));
        $customer->addresses()->create([
            'company_id' => $request->company_id,
            'job_title' => $request->job_title,
            'address_1' => $request->address_1,
            'address_2' => $request->address_2,
            'zip' => $request->zip,
            'city' => $request->city,
            'country_id' => 225,
            'status' => 1
        ]);

        return $customer;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function delete($id) {
        $customer = $this->customerRepo->findCustomerById($id);
        $address = $customer->addresses;

        if (!empty($address[0])) {
            $addressRepo = $this->entityManager::getRepository($address[0]);
            //$addRessRepo = new AddressRepository($address[0]);
            $addressRepo->deleteAddress();
        }

        //$customerRepo = new CustomerRepository($customer);
        $repo = $this->entityManager::getRepository($customer);
        $repo->deleteCustomer();
        return true;
    }

    public function convertCustomerToDeal(Customer $customer) {
        $customerRepo = $this->entityManager::getRepository($customer);
        $customerRepo->updateCustomer(['customer_type' => 1]);
    }
}
