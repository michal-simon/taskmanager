<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    private $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        $orderBy = !$request->column ? 'first_name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;
         
        $users = $this->userRepository->listUsers(['*'], $orderBy, $orderDir);
        return $users->toJson();
    }

    public function dashboard() {

        return view('index');
    }

    public function store(UserRequest $request)
    {

        $validatedData = $request->validated();

        $user = $this->userRepository->createUser([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'profile_photo' => $validatedData['profile_photo'],
            'username' => $validatedData['username'],
            'is_active' => 1,
            'email' => $validatedData['email'],
            'password' => bcrypt(str_random(10)),
        ]);

        return $user->toJson();
      }
}
