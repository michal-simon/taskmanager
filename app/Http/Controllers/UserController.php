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

    /**
     * UserController constructor.
     *
     * @param UserRepositoryInterface $userRepository
     * @param RoleRepositoryInterface $roleRepository
     */
    public function __construct(UserRepositoryInterface $userRepository, RoleRepositoryInterface $roleRepository) {
        $this->userRepository = $userRepository;
        $this->roleRepo = $roleRepository;
    }

    public function index(Request $request) {
        $orderBy = !$request->column ? 'first_name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->userRepository->searchUser(request()->input('search_term'));
        } else {
            $list = $this->userRepository->getActiveUsers(['*'], $orderBy, $orderDir);
        }

        $users = $list->map(function (User $user) {
                    return $this->transformUser($user);
                })->all();

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->userRepository->paginateArrayResults($users, $recordsPerPage);
            return $paginatedResults->toJson();
        }

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
        
        $validatedData = $request->validated();

        $user = $this->userRepository->createUser($validatedData);
        $userRepo = new UserRepository($user);

        if ($request->has('role')) {
            $userRepo->syncRoles([$request->input('role')]);
        }

        if ($request->has('department')) {
            $userRepo->syncDepartment($request->input('department'));
        }

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
            'user' => $user,
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
        $objUser = $this->userRepository->findUserById($id);
        $userRepo = new UserRepository($objUser);
        $userRepo->deleteUser();
        return response()->json('User deleted!');
    }

    /**
     * @param UpdateUserRequest $request
     * @param $id
     *
     * @return Response
     */
    public function update(UpdateUserRequest $request, int $id) {        
        $user = $this->userRepository->findUserById($id);
        $userRepo = new UserRepository($user);
        $userRepo->updateUser($request->except('_token', '_method', 'password'));

        if ($request->has('password') && !empty($request->input('password'))) {
            $user->password = Hash::make($request->input('password'));
            $user->save();
        }

        if ($request->has('role')) {
            $user->roles()->sync($request->input('role'));
        }

        if ($request->has('department')) {
            $userRepo->syncDepartment($request->input('department'));
        }

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

}
