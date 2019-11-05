<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Requests\CreateUserRequest;
use App\Requests\UpdateUserRequest;
use App\Repositories\UserRepository;
use App\Transformations\UserTransformable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use App\Repositories\DepartmentRepository;
use App\Department;
use App\Requests\SearchRequest;
use App\Services\UserService;

class UserController extends Controller {

    use UserTransformable;

    /**
     * @var UserRepositoryInterface
     */
    private $userRepository;

    /**
     * @var RoleRepositoryInterface
     */
    private $roleRepo;

    private $userService;

    /**
     * UserController constructor.
     *
     * @param UserRepositoryInterface $userRepository
     * @param RoleRepositoryInterface $roleRepository
     */
    public function __construct(UserRepositoryInterface $userRepository, RoleRepositoryInterface $roleRepository, UserService $userService) {
        $this->userRepository = $userRepository;
        $this->roleRepo = $roleRepository;
        $this->userService = $userService;
    }

    public function index(SearchRequest $request) {
        $users = $this->userService->search($request);
        return collect($users)->toJson();
    }

    public function dashboard() {

        return view('index');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateUserRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $request) {
        $user = $this->userService->create($request);
        return $this->transformUser($user);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(int $id) {
        $user = $this->userRepository->findUserById($id);
        $roles = $this->roleRepo->listRoles('created_at', 'desc');
        $arrData = [
            'user' => $this->transformUser($user),
            'roles' => $roles,
            'selectedIds' => $user->roles()->pluck('role_id')->all()
        ];

        return response()->json($arrData);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy(int $id) {
        $response = $this->userService->delete($id);
        
        if($response) {
            return response()->json('User deleted!');
        }
        
        return response()->json('User could not be deleted!');
    }

    /**
     * @param UpdateUserRequest $request
     * @param $id
     *
     * @return Response
     */
    public function update(UpdateUserRequest $request, int $id) {        
        $this->userService->update($request, $id);
        return response()->json('Updated user successfully');
    }

    public function upload(Request $request) {
        if ($request->hasFile('file') && $request->file('file') instanceof UploadedFile) {
            $user = auth()->guard('user')->user();
            $userRepo = new UserRepository($user);
            $data['profile_photo'] = $this->userRepository->saveUserImage($request->file('file'));
            $userRepo->updateUser($data);
        }

        return response()->json('file uploaded successfully');
    }

    /**
     * return a user based on username
     * @param string $username
     * @return type
     */
    public function profile(string $username) {
        $user = $this->userRepository->findUserByUsername($username);
        return response()->json($user);
    }

    public function filterUsersByDepartment(int $department_id) {
        $objDepartment = (new DepartmentRepository(new Department))->findDepartmentById($department_id);
        $users = $this->userRepository->getUsersForDepartment($objDepartment);
        return response()->json($users);
    }

    /**
     * 
     * @param \App\Http\Controllers\Request $request
     * @return type
     */
    public function filterUsers(Request $request) {
        $list = $this->userRepository->filterUsers($request->all());

        $users = $list->map(function (User $user) {
                    return $this->transformUser($user);
                })->all();

        return response()->json($users);
    }

}
