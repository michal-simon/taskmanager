<?php

namespace App\Repositories;

use App\User;
use App\Department;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateUserErrorException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;

class UserRepository extends BaseRepository implements UserRepositoryInterface {

    /**
     * UserRepository constructor.
     *
     * @param User $user
     */
    public function __construct(User $user) {
        parent::__construct($user);
        $this->model = $user;
    }

    /**
     * @param array $data
     *
     * @return User
     * @throws CreateProjectErrorException
     */
    public function createUser(array $data): User {
        try {
            $data['password'] = Hash::make($data['password']);
            return $this->create($data);
        } catch (QueryException $e) {
            throw new CreateUserErrorException($e);
        }
    }

    /**
     * @param int $id
     *
     * @return User
     * @throws \Exception
     */
    public function findUserById(int $id): User {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateUser(array $data): bool {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteUser(): bool {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listUsers($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Support {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * 
     * @param type $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return type
     */
    public function getActiveUsers($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Collection {

        return User::where('is_active', 1)
                        ->orderBy($orderBy, $sortBy)
                        ->get();
    }

    /**
     * @param string $text
     * @return mixed
     */
    public function searchUser(string $text = null): Collection {
        if (is_null($text)) {
            return $this->getActiveUsers();
        }
        return User::where('is_active', 1)->search($text)->get();
    }

    /**
     * @param array $roleIds
     */
    public function syncRoles(array $roleIds) {

        $mappedObjects = [];

        foreach ($roleIds[0] as $roleId) {
            $mappedObjects[] = $roleId;
        }

        return $this->model->roles()->sync($mappedObjects);
    }

    /**
     * 
     * @param string $username
     * @return User
     */
    public function findUserByUsername(string $username): User {
        return $this->model->where('username', $username)->first();
    }

    /**
     * 
     * @param string $username
     * @return User
     */
    public function getUsersForDepartment(Department $objDepartment): Support {
        return $this->model->join('department_user', 'department_user.user_id', '=', 'users.id')
                        ->select('users.*')
                        ->where('department_user.department_id', $objDepartment->id)
                        ->groupBy('users.id')
                        ->get();
    }

    /**
     * @param UploadedFile $file
     * @return string
     */
    public function saveUserImage(UploadedFile $file): string {
        return $file->store('users', ['disk' => 'public']);
    }

    /**
     * Sync the categories
     *
     * @param array $params
     */
    public function syncDepartment(int $department_id) {
        return $this->model->departments()->sync($department_id);
    }

    /**
     * 
     * @param array $arrFilters
     * @param type $task_type
     * @return Support
     */
    public function filterUsers(array $arrFilters): Collection {

        $query = $this->model->select('users.id as id', 'users.*')
                ->leftJoin('department_user', 'users.id', '=', 'department_user.user_id')
                ->leftJoin('role_user', 'users.id', '=', 'role_user.user_id');

        foreach ($arrFilters as $column => $value) {
            $query->where($column, '=', $value);
        }
        
        $query->groupBy('users.id');

        return $query->get();
    }

}
