<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Requests\CreateMessageRequest;
use App\Repositories\Interfaces\MessageRepositoryInterface;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Transformations\MessageUserTransformable;
use App\Transformations\MessageTransformable;
use App\Customer;
use App\Message;

class MessageController extends Controller {

    use MessageUserTransformable,
        MessageTransformable;

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
        $currentUser = $this->userRepo->findUserById(56);

        $customers = $customerList->map(function (Customer $customer) use ($currentUser) {
                    return $this->transformUser($customer, $currentUser);
                })->all();

        return response()->json($customers);
    }

    /**
     * 
     * @param int $customer_id
     * @return type
     */
    public function index(int $customer_id) {

        $currentUser = $this->userRepo->findUserById(56);
        $customer = $this->customerRepo->findCustomerById($customer_id);
        $messageList = $this->messageRepo->getMessagesForCustomer($customer, $currentUser);


        $messages = $messageList->map(function (Message $message) use ($currentUser, $customer) {
                    return $this->transformMessage($message, $currentUser, $customer);
                })->all();

        return response()->json($messages);
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
