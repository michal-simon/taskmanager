<?php
namespace App\Repositories;

use App\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateUserErrorException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
    * UserRepository constructor.
    *
    * @param User $user
    */
    public function __construct(User $user)
    {
        parent::__construct($user);
        $this->model = $user;
    }

    /**
    * @param array $data
    *
    * @return User
    * @throws CreateProjectErrorException
    */
    public function createUser(array $data) : User
    {
        try {
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
    public function findUserById(int $id) : User
    {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateUser(array $data) : bool
    {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteUser() : bool
    {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listUsers($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Support
    {
        return $this->all($columns, $orderBy, $sortBy);
    }
    
    /**
     * 
     * @param type $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return type
     */
    public function getActiveUsers($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection {
        
         return User::where('is_active', 1)
                             ->orderBy($orderBy, $sortBy)
                            ->get();
    }
    
    /**
     * @param string $text
     * @return mixed
     */
    public function searchUser(string $text = null) : Collection
    {
        if (is_null($text)) {
            return $this->getActiveUsers();
        }
        return User::where('is_active', 1)->search($text)->get();
    }

}