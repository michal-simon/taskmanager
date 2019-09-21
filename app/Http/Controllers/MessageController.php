<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Requests\CreateMessageRequest;
use App\Repositories\Interfaces\MessageRepositoryInterface;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Transformations\MessageUserTransformable;
use App\Customer;

class MessageController extends Controller {

    use MessageUserTransformable;

    /**
     * @var MessageRepositoryInterface
     */
    private $messageRepo;

    /**
     * @var CustomerRepositoryInterface
     */
    private $customerRepo;

    /**
     * @var UserRepositoryInterface
     */
    private $userRepo;

    /**
     * MessageController constructor.
     * @param MessageRepositoryInterface $messageRepository
     * CustomerRepositoryInterface $customerRepository
     * UserRepositoryInterface $userRepository
     */
    public function __construct(MessageRepositoryInterface $messageRepository, CustomerRepositoryInterface $customerRepository, UserRepositoryInterface $userRepository) {
        $this->messageRepo = $messageRepository;
        $this->customerRepo = $customerRepository;
        $this->userRepo = $userRepository;
    }

    public function getCustomers() {

        $customerList = $this->customerRepo->listCustomers();
        
        $messages = $customers = $customerList->map(function (Customer $customer) {
                    return $this->transformUser($customer);
                })->all();

        return response()->json($messages);
    }

    public function index() {
        $arrMessages[0] = [
            'author' => "Brad Pitt",
            'avatar' => "https://mdbootstrap.com/img/Photos/Avatars/avatar-6",
            'when' => "12 mins ago",
            'message' => 'Test Mike'
        ];

        $arrMessages[1] = [
            'author' => "Jhoanna Hampton",
            'avatar' => "https://mdbootstrap.com/img/Photos/Avatars/avatar-6",
            'when' => "12 mins ago",
            'message' => 'Test Jhoanna'
        ];

        return response()->json($arrMessages);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCustomerRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateMessageRequest $request) {
        $message = $this->messageRepo->createMessage($request->except('_token', '_method', 'when'));
        return $message->toJson();
    }

}
