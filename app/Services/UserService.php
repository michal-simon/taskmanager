<?php
namespace App\Services;
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
use App\Services\Interfaces\UserServiceInterface;
use App\Services\EntityManager;

class UserService implements UserServiceInterface {
    use UserTransformable;
    /**
     * @var UserRepositoryInterface
     */
    private $userRepository;
    /**
     * @var RoleRepositoryInterface
     */
    private $roleRepo;
    
    private $entityManager;
    
/**
     * UserController constructor.
     *
     * @param UserRepositoryInterface $userRepository
     * @param RoleRepositoryInterface $roleRepository
     */
    public function __construct(UserRepositoryInterface $userRepository, RoleRepositoryInterface $roleRepository) {
        $this->userRepository = $userRepository;
        $this->roleRepo = $roleRepository;
        $this->entityManager = new EntityManager();
    }

    public function search(SearchRequest $request) {
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
             $paginatedResults = $this->userRepository->paginateCollection($list, $recordsPerPage);
            return $paginatedResults;
        }
        return $users;
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateUserRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function create(CreateUserRequest $request) {
        
        $validatedData = $request->validated();
        $user = $this->userRepository->createUser($validatedData);
        //$userRepo = new UserRepository($user);
        $userRepo = $this->entityManager::getRepository($user);
        if ($request->has('role')) {
            $userRepo->syncRoles([$request->input('role')]);
        }
        if ($request->has('department')) {
            $userRepo->syncDepartment($request->input('department'));
        }

        return $user;
    }

    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function delete(int $id) {
        $objUser = $this->userRepository->findUserById($id);
        $userRepo = $this->entityManager::getRepository($objUser);
        //$userRepo = new UserRepository($objUser);
        $userRepo->deleteUser();
        return true;
    }

    /**
     * @param UpdateUserRequest $request
     * @param $id
     *
     * @return Response
     */
    public function update(UpdateUserRequest $request, int $id) {        
        $user = $this->userRepository->findUserById($id);
        //$userRepo = new UserRepository($user);
        $userRepo = $this->entityManager::getRepository($user);
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
        return true;
    }

    public function upload(Request $request) {
        if ($request->hasFile('file') && $request->file('file') instanceof UploadedFile) {
            $user = auth()->guard('user')->user();
            //$userRepo = new UserRepository($user);
            $userRepo = $this->entityManager::getRepository($user);
            $data['profile_photo'] = $this->userRepository->saveUserImage($request->file('file'));
            $userRepo->updateUser($data);
        }
        return true;
    }
}
